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
exports.ReproductionService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReproductionService = class ReproductionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateAnimal(animalId, farmId) {
        const animal = await this.prisma.animal.findFirst({ where: { id: animalId, farmId } });
        if (!animal)
            throw new common_1.NotFoundException(`Animal con id ${animalId} no encontrado en esta finca`);
        return animal;
    }
    async createEvent(farmId, dto) {
        await this.validateAnimal(dto.femaleId, farmId);
        if (dto.maleId) {
            const bull = await this.prisma.animal.findFirst({ where: { id: dto.maleId, farmId, sex: client_1.AnimalSex.MALE } });
            if (!bull)
                throw new common_1.NotFoundException(`Toro con id ${dto.maleId} no encontrado`);
        }
        return this.prisma.reproductiveEvent.create({
            data: { ...dto },
            include: { female: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async findAllEvents(farmId, femaleId, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            female: { farmId },
            ...(femaleId && { femaleId }),
        };
        const [data, total] = await Promise.all([
            this.prisma.reproductiveEvent.findMany({
                where,
                skip,
                take,
                orderBy: { eventDate: 'desc' },
                include: { female: { select: { id: true, tagNumber: true, name: true } } },
            }),
            this.prisma.reproductiveEvent.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOneEvent(id, farmId) {
        const event = await this.prisma.reproductiveEvent.findFirst({
            where: { id, female: { farmId } },
            include: { female: true },
        });
        if (!event)
            throw new common_1.NotFoundException(`Evento reproductivo con id ${id} no encontrado`);
        return event;
    }
    async removeEvent(id, farmId) {
        await this.findOneEvent(id, farmId);
        return this.prisma.reproductiveEvent.delete({ where: { id } });
    }
    async createPregnancy(farmId, dto) {
        const animal = await this.validateAnimal(dto.femaleId, farmId);
        if (animal.sex !== client_1.AnimalSex.FEMALE) {
            throw new common_1.BadRequestException('Solo se puede registrar preñez para animales hembra');
        }
        const activePregnancy = await this.prisma.pregnancy.findFirst({
            where: { femaleId: dto.femaleId, status: client_1.PregnancyStatus.IN_PROGRESS },
        });
        if (activePregnancy)
            throw new common_1.BadRequestException('El animal ya tiene una preñez activa');
        return this.prisma.pregnancy.create({
            data: { ...dto },
            include: { female: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async findAllPregnancies(farmId, femaleId, status, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            female: { farmId },
            ...(femaleId && { femaleId }),
            ...(status && { status }),
        };
        const [data, total] = await Promise.all([
            this.prisma.pregnancy.findMany({
                where,
                skip,
                take,
                orderBy: { conceptionDate: 'desc' },
                include: { female: { select: { id: true, tagNumber: true, name: true } } },
            }),
            this.prisma.pregnancy.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOnePregnancy(id, farmId) {
        const pregnancy = await this.prisma.pregnancy.findFirst({
            where: { id, female: { farmId } },
            include: { female: true },
        });
        if (!pregnancy)
            throw new common_1.NotFoundException(`Registro de preñez con id ${id} no encontrado`);
        return pregnancy;
    }
    async updatePregnancy(id, farmId, dto) {
        await this.findOnePregnancy(id, farmId);
        return this.prisma.pregnancy.update({
            where: { id },
            data: dto,
            include: { female: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async getUpcomingBirths(farmId, daysAhead = 30) {
        const now = new Date();
        const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        return this.prisma.pregnancy.findMany({
            where: {
                female: { farmId },
                status: client_1.PregnancyStatus.IN_PROGRESS,
                expectedBirthDate: { gte: now, lte: future },
            },
            orderBy: { expectedBirthDate: 'asc' },
            include: { female: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async updateEvent(id, farmId, dto) {
        await this.findOneEvent(id, farmId);
        return this.prisma.reproductiveEvent.update({
            where: { id },
            data: {
                ...(dto.type && { type: dto.type }),
                ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
                ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
                ...(dto.bullSemen !== undefined && { bullSemen: dto.bullSemen ?? null }),
                ...(dto.technicianName !== undefined && { technicianName: dto.technicianName ?? null }),
                ...(dto.maleId !== undefined && { maleId: dto.maleId || null }),
            },
            include: { female: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async deletePregnancy(id, farmId) {
        await this.findOnePregnancy(id, farmId);
        return this.prisma.pregnancy.delete({ where: { id } });
    }
};
exports.ReproductionService = ReproductionService;
exports.ReproductionService = ReproductionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReproductionService);
//# sourceMappingURL=reproduction.service.js.map