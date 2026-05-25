import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const ANIMAL_PHOTOS_BUCKET = 'animal-photos';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        'Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas',
      );
    }

    // Use service-role key so uploads bypass RLS
    this.client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  /** Ensures the animal-photos bucket exists and is public on startup */
  async onModuleInit() {
    const { data: buckets, error } = await this.client.storage.listBuckets();
    if (error) {
      this.logger.warn(`No se pudo listar los buckets de Supabase: ${error.message}`);
      return;
    }

    const exists = buckets?.some((b) => b.name === ANIMAL_PHOTOS_BUCKET);
    if (!exists) {
      const { error: createError } = await this.client.storage.createBucket(
        ANIMAL_PHOTOS_BUCKET,
        {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          fileSizeLimit: 5 * 1024 * 1024, // 5 MB
        },
      );
      if (createError) {
        this.logger.warn(`No se pudo crear el bucket "${ANIMAL_PHOTOS_BUCKET}": ${createError.message}`);
      } else {
        this.logger.log(`Bucket "${ANIMAL_PHOTOS_BUCKET}" creado exitosamente`);
      }
    } else {
      this.logger.log(`Bucket "${ANIMAL_PHOTOS_BUCKET}" listo`);
    }
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Uploads a file buffer to Supabase Storage.
   * @returns The public URL of the uploaded file.
   */
  async uploadFile(
    bucket: string,
    path: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, buffer, { contentType: mimetype, upsert: true });

    if (error) throw new Error(`Error al subir archivo a Supabase: ${error.message}`);

    const { data: urlData } = this.client.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  }

  /**
   * Deletes a file from Supabase Storage given its full public URL.
   * Extracts the path automatically — safe if the URL doesn't match.
   */
  async deleteFileByUrl(bucket: string, publicUrl: string): Promise<void> {
    try {
      // Public URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
      const marker = `/object/public/${bucket}/`;
      const idx = publicUrl.indexOf(marker);
      if (idx === -1) return;
      const filePath = publicUrl.slice(idx + marker.length);
      await this.client.storage.from(bucket).remove([filePath]);
    } catch {
      // Non-fatal: log but don't throw
    }
  }
}
