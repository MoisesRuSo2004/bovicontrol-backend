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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalsService = void 0;
const common_1 = require("@nestjs/common");
const MAX_GALLERY_PHOTOS = 5;
const path_1 = require("path");
const uuid_1 = require("uuid");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../prisma/prisma.service");
const supabase_service_1 = require("../../supabase/supabase.service");
let AnimalsService = class AnimalsService {
    prisma;
    supabase;
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async create(farmId, dto) {
        const existing = await this.prisma.animal.findFirst({
            where: { tagNumber: dto.tagNumber, farmId },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Ya existe un animal con el arete "${dto.tagNumber}" en esta finca`);
        }
        if (dto.breedId) {
            const breed = await this.prisma.breed.findUnique({ where: { id: dto.breedId } });
            if (!breed)
                throw new common_1.NotFoundException(`Raza con id ${dto.breedId} no encontrada`);
        }
        if (dto.fatherId) {
            const father = await this.prisma.animal.findFirst({ where: { id: dto.fatherId, farmId } });
            if (!father)
                throw new common_1.NotFoundException(`Padre con id ${dto.fatherId} no encontrado en esta finca`);
        }
        if (dto.motherId) {
            const mother = await this.prisma.animal.findFirst({ where: { id: dto.motherId, farmId } });
            if (!mother)
                throw new common_1.NotFoundException(`Madre con id ${dto.motherId} no encontrada en esta finca`);
        }
        return this.prisma.animal.create({
            data: {
                ...dto,
                farmId,
                ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
            },
            include: { breed: true, father: { select: { id: true, tagNumber: true, name: true } }, mother: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async findAll(farmId, query) {
        const { page = 1, limit = 20, status, sex, breedId, search } = query;
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            farmId,
            ...(status && { status }),
            ...(sex && { sex }),
            ...(breedId && { breedId }),
            ...(search && {
                OR: [
                    { tagNumber: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.animal.findMany({
                where,
                skip,
                take,
                orderBy: { tagNumber: 'asc' },
                include: {
                    breed: { select: { id: true, name: true } },
                    father: { select: { id: true, tagNumber: true, name: true } },
                    mother: { select: { id: true, tagNumber: true, name: true } },
                },
            }),
            this.prisma.animal.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async getCategorySummary(farmId) {
        const now = new Date();
        const animals = await this.prisma.animal.findMany({
            where: { farmId, status: 'ACTIVE' },
            select: {
                id: true,
                tagNumber: true,
                name: true,
                sex: true,
                birthDate: true,
                currentWeight: true,
                photoUrl: true,
                breed: { select: { name: true } },
                pregnanciesAsFemale: {
                    where: { status: { in: ['IN_PROGRESS', 'COMPLETED'] } },
                    select: { status: true, actualBirthDate: true },
                    orderBy: { conceptionDate: 'desc' },
                },
            },
            orderBy: { tagNumber: 'asc' },
        });
        const getAgeMonths = (birthDate) => {
            if (!birthDate)
                return null;
            return Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
        };
        const categorized = animals.map((animal) => {
            const ageMonths = getAgeMonths(animal.birthDate);
            let category;
            if (animal.sex === 'MALE') {
                if (ageMonths === null || ageMonths >= 24)
                    category = 'TORO';
                else if (ageMonths < 8)
                    category = 'TERNERO';
                else
                    category = 'MACHO_LEVANTE';
            }
            else {
                if (ageMonths !== null && ageMonths < 8) {
                    category = 'TERNERA';
                }
                else {
                    const activePreg = animal.pregnanciesAsFemale.find((p) => p.status === 'IN_PROGRESS');
                    const lastBirth = animal.pregnanciesAsFemale.find((p) => p.status === 'COMPLETED' && p.actualBirthDate != null);
                    if (activePreg) {
                        category = 'VACA_PRENADA';
                    }
                    else if (lastBirth?.actualBirthDate) {
                        const monthsSince = Math.floor((now.getTime() - lastBirth.actualBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
                        category = monthsSince <= 10 ? 'VACA_PARIDA' : 'VACA_ESCOTERAS';
                    }
                    else {
                        category = 'NOVILLA';
                    }
                }
            }
            return {
                id: animal.id,
                tagNumber: animal.tagNumber,
                name: animal.name,
                sex: animal.sex,
                ageMonths,
                currentWeight: animal.currentWeight,
                photoUrl: animal.photoUrl,
                breedName: animal.breed?.name ?? null,
                category,
            };
        });
        const counts = {};
        for (const a of categorized) {
            counts[a.category] = (counts[a.category] ?? 0) + 1;
        }
        const ORDER = ['TERNERO', 'TERNERA', 'MACHO_LEVANTE', 'TORO', 'NOVILLA', 'VACA_PRENADA', 'VACA_PARIDA', 'VACA_ESCOTERAS'];
        const categories = ORDER.map((key) => ({ key, count: counts[key] ?? 0 })).filter((c) => c.count > 0);
        return { total: animals.length, categories, animals: categorized };
    }
    async findOne(id, farmId) {
        const animal = await this.prisma.animal.findFirst({
            where: { id, farmId },
            include: {
                breed: true,
                father: { select: { id: true, tagNumber: true, name: true, sex: true } },
                mother: { select: { id: true, tagNumber: true, name: true, sex: true } },
                fatherOf: { select: { id: true, tagNumber: true, name: true, sex: true, status: true } },
                motherOf: { select: { id: true, tagNumber: true, name: true, sex: true, status: true } },
                _count: {
                    select: {
                        reproductiveEventsAsFemale: true,
                        pregnanciesAsFemale: true,
                        vaccinations: true,
                        treatments: true,
                        milkRecords: true,
                        weightRecords: true,
                    },
                },
            },
        });
        if (!animal)
            throw new common_1.NotFoundException(`Animal con id ${id} no encontrado en esta finca`);
        return animal;
    }
    async update(id, farmId, dto) {
        await this.findOne(id, farmId);
        if (dto.tagNumber) {
            const existing = await this.prisma.animal.findFirst({
                where: { tagNumber: dto.tagNumber, farmId, NOT: { id } },
            });
            if (existing)
                throw new common_1.BadRequestException(`Ya existe otro animal con el arete "${dto.tagNumber}"`);
        }
        return this.prisma.animal.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
            },
            include: { breed: true },
        });
    }
    async remove(id, farmId) {
        const animal = await this.findOne(id, farmId);
        if (animal.photoUrl) {
            await this.supabase.deleteFileByUrl(supabase_service_1.ANIMAL_PHOTOS_BUCKET, animal.photoUrl);
        }
        return this.prisma.animal.delete({ where: { id } });
    }
    async updatePhoto(id, farmId, buffer, mimetype, originalName) {
        const animal = await this.findOne(id, farmId);
        if (animal.photoUrl) {
            await this.supabase.deleteFileByUrl(supabase_service_1.ANIMAL_PHOTOS_BUCKET, animal.photoUrl);
        }
        const ext = ((0, path_1.extname)(originalName) || '.jpg').toLowerCase();
        const storagePath = `${id}/${(0, uuid_1.v4)()}${ext}`;
        const photoUrl = await this.supabase.uploadFile(supabase_service_1.ANIMAL_PHOTOS_BUCKET, storagePath, buffer, mimetype);
        return this.prisma.animal.update({
            where: { id },
            data: { photoUrl },
            include: {
                breed: true,
                father: { select: { id: true, tagNumber: true, name: true, sex: true } },
                mother: { select: { id: true, tagNumber: true, name: true, sex: true } },
            },
        });
    }
    async removePhoto(id, farmId) {
        const animal = await this.findOne(id, farmId);
        if (animal.photoUrl) {
            await this.supabase.deleteFileByUrl(supabase_service_1.ANIMAL_PHOTOS_BUCKET, animal.photoUrl);
        }
        await this.prisma.animal.update({ where: { id }, data: { photoUrl: null } });
    }
    async getGallery(id, farmId) {
        await this.findOne(id, farmId);
        return this.prisma.animalPhoto.findMany({
            where: { animalId: id },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addGalleryPhoto(id, farmId, buffer, mimetype, originalName) {
        await this.findOne(id, farmId);
        const count = await this.prisma.animalPhoto.count({ where: { animalId: id } });
        if (count >= MAX_GALLERY_PHOTOS) {
            throw new common_1.BadRequestException(`El animal ya tiene el máximo de ${MAX_GALLERY_PHOTOS} fotos en su galería`);
        }
        const ext = ((0, path_1.extname)(originalName) || '.jpg').toLowerCase();
        const storagePath = `gallery/${id}/${(0, uuid_1.v4)()}${ext}`;
        const url = await this.supabase.uploadFile(supabase_service_1.ANIMAL_PHOTOS_BUCKET, storagePath, buffer, mimetype);
        return this.prisma.animalPhoto.create({ data: { animalId: id, url } });
    }
    async removeGalleryPhoto(id, farmId, photoId) {
        await this.findOne(id, farmId);
        const photo = await this.prisma.animalPhoto.findFirst({
            where: { id: photoId, animalId: id },
        });
        if (!photo)
            throw new common_1.NotFoundException(`Foto con id ${photoId} no encontrada`);
        await this.supabase.deleteFileByUrl(supabase_service_1.ANIMAL_PHOTOS_BUCKET, photo.url);
        await this.prisma.animalPhoto.delete({ where: { id: photoId } });
    }
    async getStats(farmId) {
        const [total, bySex, byStatus, pregnancies] = await Promise.all([
            this.prisma.animal.count({ where: { farmId } }),
            this.prisma.animal.groupBy({ by: ['sex'], where: { farmId }, _count: true }),
            this.prisma.animal.groupBy({ by: ['status'], where: { farmId }, _count: true }),
            this.prisma.pregnancy.count({ where: { female: { farmId }, status: 'IN_PROGRESS' } }),
        ]);
        const active = byStatus.find((s) => s.status === 'ACTIVE')?._count ?? 0;
        const females = bySex.find((s) => s.sex === 'FEMALE')?._count ?? 0;
        const males = bySex.find((s) => s.sex === 'MALE')?._count ?? 0;
        return { total, active, females, males, pregnancies, bySex, byStatus };
    }
};
exports.AnimalsService = AnimalsService;
exports.AnimalsService = AnimalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], AnimalsService);
//# sourceMappingURL=animals.service.js.map