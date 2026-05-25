"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = exports.ANIMAL_PHOTOS_BUCKET = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
exports.ANIMAL_PHOTOS_BUCKET = 'animal-photos';
let SupabaseService = SupabaseService_1 = class SupabaseService {
    logger = new common_1.Logger(SupabaseService_1.name);
    client;
    constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas');
        }
        this.client = (0, supabase_js_1.createClient)(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    async onModuleInit() {
        const { data: buckets, error } = await this.client.storage.listBuckets();
        if (error) {
            this.logger.warn(`No se pudo listar los buckets de Supabase: ${error.message}`);
            return;
        }
        const exists = buckets?.some((b) => b.name === exports.ANIMAL_PHOTOS_BUCKET);
        if (!exists) {
            const { error: createError } = await this.client.storage.createBucket(exports.ANIMAL_PHOTOS_BUCKET, {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                fileSizeLimit: 5 * 1024 * 1024,
            });
            if (createError) {
                this.logger.warn(`No se pudo crear el bucket "${exports.ANIMAL_PHOTOS_BUCKET}": ${createError.message}`);
            }
            else {
                this.logger.log(`Bucket "${exports.ANIMAL_PHOTOS_BUCKET}" creado exitosamente`);
            }
        }
        else {
            this.logger.log(`Bucket "${exports.ANIMAL_PHOTOS_BUCKET}" listo`);
        }
    }
    getClient() {
        return this.client;
    }
    async uploadFile(bucket, path, buffer, mimetype) {
        const { data, error } = await this.client.storage
            .from(bucket)
            .upload(path, buffer, { contentType: mimetype, upsert: true });
        if (error)
            throw new Error(`Error al subir archivo a Supabase: ${error.message}`);
        const { data: urlData } = this.client.storage.from(bucket).getPublicUrl(data.path);
        return urlData.publicUrl;
    }
    async deleteFileByUrl(bucket, publicUrl) {
        try {
            const marker = `/object/public/${bucket}/`;
            const idx = publicUrl.indexOf(marker);
            if (idx === -1)
                return;
            const filePath = publicUrl.slice(idx + marker.length);
            await this.client.storage.from(bucket).remove([filePath]);
        }
        catch {
        }
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = SupabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map