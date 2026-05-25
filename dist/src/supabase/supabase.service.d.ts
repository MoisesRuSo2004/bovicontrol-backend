import { OnModuleInit } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
export declare const ANIMAL_PHOTOS_BUCKET = "animal-photos";
export declare class SupabaseService implements OnModuleInit {
    private readonly logger;
    private readonly client;
    constructor();
    onModuleInit(): Promise<void>;
    getClient(): SupabaseClient;
    uploadFile(bucket: string, path: string, buffer: Buffer, mimetype: string): Promise<string>;
    deleteFileByUrl(bucket: string, publicUrl: string): Promise<void>;
}
