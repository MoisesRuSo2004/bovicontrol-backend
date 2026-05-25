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
exports.FarmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FarmsService = class FarmsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (dto.rut) {
            const existing = await this.prisma.farm.findUnique({ where: { rut: dto.rut } });
            if (existing)
                throw new common_1.ConflictException(`Ya existe una finca con el RUT ${dto.rut}`);
        }
        return this.prisma.farm.create({ data: dto });
    }
    async findAll() {
        return this.prisma.farm.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                location: true,
                department: true,
                municipality: true,
                areaHectares: true,
                phone: true,
                email: true,
                rut: true,
                isActive: true,
                createdAt: true,
                _count: { select: { animals: true, users: true } },
            },
        });
    }
    async findOne(id) {
        const farm = await this.prisma.farm.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { animals: true, users: true },
                },
            },
        });
        if (!farm)
            throw new common_1.NotFoundException(`Finca con id ${id} no encontrada`);
        return farm;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.rut) {
            const existing = await this.prisma.farm.findFirst({
                where: { rut: dto.rut, NOT: { id } },
            });
            if (existing)
                throw new common_1.ConflictException(`Ya existe otra finca con el RUT ${dto.rut}`);
        }
        return this.prisma.farm.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.farm.delete({ where: { id } });
    }
};
exports.FarmsService = FarmsService;
exports.FarmsService = FarmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FarmsService);
//# sourceMappingURL=farms.service.js.map