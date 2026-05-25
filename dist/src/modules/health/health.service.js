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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../prisma/prisma.service");
let HealthService = class HealthService {
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
    async createVaccine(dto) {
        return this.prisma.vaccine.create({ data: dto });
    }
    async findAllVaccines() {
        return this.prisma.vaccine.findMany({ orderBy: { name: 'asc' } });
    }
    async findOneVaccine(id) {
        const v = await this.prisma.vaccine.findUnique({ where: { id } });
        if (!v)
            throw new common_1.NotFoundException(`Vacuna con id ${id} no encontrada`);
        return v;
    }
    async createMedication(dto) {
        return this.prisma.medication.create({ data: dto });
    }
    async findAllMedications() {
        return this.prisma.medication.findMany({ orderBy: { name: 'asc' } });
    }
    async findOneMedication(id) {
        const m = await this.prisma.medication.findUnique({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException(`Medicamento con id ${id} no encontrado`);
        return m;
    }
    async createVaccination(farmId, dto) {
        await this.validateAnimal(dto.animalId, farmId);
        await this.findOneVaccine(dto.vaccineId);
        return this.prisma.vaccination.create({
            data: {
                ...dto,
                appliedDate: new Date(dto.appliedDate),
                ...(dto.nextDueDate ? { nextDueDate: new Date(dto.nextDueDate) } : {}),
            },
            include: {
                animal: { select: { id: true, tagNumber: true, name: true } },
                vaccine: { select: { id: true, name: true } },
            },
        });
    }
    async findAllVaccinations(farmId, animalId, from, to, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            animal: { farmId },
            ...(animalId && { animalId }),
            ...(from || to ? { appliedDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.vaccination.findMany({
                where,
                skip,
                take,
                orderBy: { appliedDate: 'desc' },
                include: {
                    animal: { select: { id: true, tagNumber: true, name: true } },
                    vaccine: { select: { id: true, name: true } },
                },
            }),
            this.prisma.vaccination.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async getUpcomingVaccinations(farmId, daysAhead = 30) {
        const now = new Date();
        const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        const overdueCutoff = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        return this.prisma.vaccination.findMany({
            where: {
                animal: { farmId, status: 'ACTIVE' },
                nextDueDate: { gte: overdueCutoff, lte: future },
            },
            orderBy: { nextDueDate: 'asc' },
            include: {
                animal: { select: { id: true, tagNumber: true, name: true } },
                vaccine: { select: { id: true, name: true } },
            },
        });
    }
    async findOneVaccination(id, farmId) {
        const v = await this.prisma.vaccination.findFirst({
            where: { id, animal: { farmId } },
            include: { animal: true, vaccine: true },
        });
        if (!v)
            throw new common_1.NotFoundException(`Vacunación con id ${id} no encontrada`);
        return v;
    }
    async updateVaccination(id, farmId, dto) {
        await this.findOneVaccination(id, farmId);
        if (dto.vaccineId)
            await this.findOneVaccine(dto.vaccineId);
        return this.prisma.vaccination.update({
            where: { id },
            data: {
                ...(dto.vaccineId && { vaccineId: dto.vaccineId }),
                ...(dto.appliedDate && { appliedDate: new Date(dto.appliedDate) }),
                ...(dto.nextDueDate !== undefined && {
                    nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : null,
                }),
                ...(dto.doseMl !== undefined && { doseMl: dto.doseMl ?? null }),
                ...(dto.batchNumber !== undefined && { batchNumber: dto.batchNumber ?? null }),
                ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
            },
            include: {
                animal: { select: { id: true, tagNumber: true, name: true } },
                vaccine: { select: { id: true, name: true } },
            },
        });
    }
    async deleteVaccination(id, farmId) {
        await this.findOneVaccination(id, farmId);
        return this.prisma.vaccination.delete({ where: { id } });
    }
    async createTreatment(farmId, dto) {
        await this.validateAnimal(dto.animalId, farmId);
        if (dto.medicationId)
            await this.findOneMedication(dto.medicationId);
        return this.prisma.treatment.create({
            data: { ...dto },
            include: {
                animal: { select: { id: true, tagNumber: true, name: true } },
                medication: { select: { id: true, name: true } },
            },
        });
    }
    async findAllTreatments(farmId, animalId, status, from, to, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            animal: { farmId },
            ...(animalId && { animalId }),
            ...(status && { status }),
            ...(from || to ? { startDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.treatment.findMany({
                where,
                skip,
                take,
                orderBy: { startDate: 'desc' },
                include: {
                    animal: { select: { id: true, tagNumber: true, name: true } },
                    medication: { select: { id: true, name: true } },
                },
            }),
            this.prisma.treatment.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOneTreatment(id, farmId) {
        const t = await this.prisma.treatment.findFirst({
            where: { id, animal: { farmId } },
            include: { animal: true, medication: true },
        });
        if (!t)
            throw new common_1.NotFoundException(`Tratamiento con id ${id} no encontrado`);
        return t;
    }
    async updateTreatment(id, farmId, data) {
        await this.findOneTreatment(id, farmId);
        return this.prisma.treatment.update({ where: { id }, data });
    }
    async createDisease(farmId, dto) {
        await this.validateAnimal(dto.animalId, farmId);
        return this.prisma.disease.create({
            data: { ...dto },
            include: { animal: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async findAllDiseases(farmId, animalId, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            animal: { farmId },
            ...(animalId && { animalId }),
        };
        const [data, total] = await Promise.all([
            this.prisma.disease.findMany({
                where,
                skip,
                take,
                orderBy: { diagnosisDate: 'desc' },
                include: {
                    animal: { select: { id: true, tagNumber: true, name: true } },
                },
            }),
            this.prisma.disease.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOneDisease(id, farmId) {
        const d = await this.prisma.disease.findFirst({
            where: { id, animal: { farmId } },
            include: { animal: true },
        });
        if (!d)
            throw new common_1.NotFoundException(`Enfermedad con id ${id} no encontrada`);
        return d;
    }
    async updateDisease(id, farmId, data) {
        await this.findOneDisease(id, farmId);
        return this.prisma.disease.update({ where: { id }, data });
    }
    async createAlert(farmId, dto) {
        if (dto.animalId)
            await this.validateAnimal(dto.animalId, farmId);
        return this.prisma.healthAlert.create({ data: { ...dto, farmId } });
    }
    async findAllAlerts(farmId, isCompleted, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
            farmId,
            ...(isCompleted !== undefined && { isCompleted }),
        };
        const [data, total] = await Promise.all([
            this.prisma.healthAlert.findMany({
                where,
                skip,
                take,
                orderBy: { scheduledDate: 'asc' },
                include: { animal: { select: { id: true, tagNumber: true, name: true } } },
            }),
            this.prisma.healthAlert.count({ where }),
        ]);
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async getUpcomingAlerts(farmId, daysAhead = 7) {
        const now = new Date();
        const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        return this.prisma.healthAlert.findMany({
            where: {
                farmId,
                isCompleted: false,
                scheduledDate: { gte: now, lte: future },
            },
            orderBy: { scheduledDate: 'asc' },
            include: { animal: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async resolveAlert(id, farmId) {
        const alert = await this.prisma.healthAlert.findFirst({ where: { id, farmId } });
        if (!alert)
            throw new common_1.NotFoundException(`Alerta con id ${id} no encontrada`);
        return this.prisma.healthAlert.update({
            where: { id },
            data: { isCompleted: true, completedAt: new Date() },
        });
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map