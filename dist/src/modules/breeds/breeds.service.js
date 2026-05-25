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
exports.BreedsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BreedsService = class BreedsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.breed.findFirst({ where: { name: { equals: dto.name, mode: 'insensitive' } } });
        if (existing)
            throw new common_1.ConflictException(`Ya existe una raza con el nombre "${dto.name}"`);
        return this.prisma.breed.create({ data: dto });
    }
    async findAll() {
        return this.prisma.breed.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { animals: true } } },
        });
    }
    async findOne(id) {
        const breed = await this.prisma.breed.findUnique({
            where: { id },
            include: { _count: { select: { animals: true } } },
        });
        if (!breed)
            throw new common_1.NotFoundException(`Raza con id ${id} no encontrada`);
        return breed;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.name) {
            const existing = await this.prisma.breed.findFirst({
                where: { name: { equals: dto.name, mode: 'insensitive' }, NOT: { id } },
            });
            if (existing)
                throw new common_1.ConflictException(`Ya existe otra raza con el nombre "${dto.name}"`);
        }
        return this.prisma.breed.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const breed = await this.findOne(id);
        if (breed._count.animals > 0) {
            throw new common_1.ConflictException('No puedes eliminar una raza que tiene animales asociados');
        }
        return this.prisma.breed.delete({ where: { id } });
    }
};
exports.BreedsService = BreedsService;
exports.BreedsService = BreedsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BreedsService);
//# sourceMappingURL=breeds.service.js.map