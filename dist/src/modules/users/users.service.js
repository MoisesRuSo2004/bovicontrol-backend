"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const USER_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    username: true,
    phone: true,
    role: true,
    isActive: true,
    farmId: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Ya existe un usuario con este email');
        const farm = await this.prisma.farm.findUnique({ where: { id: dto.farmId } });
        if (!farm)
            throw new common_1.BadRequestException('La finca especificada no existe');
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        return this.prisma.user.create({
            data: { ...dto, password: hashedPassword },
            select: USER_SELECT,
        });
    }
    async findAll(farmId) {
        return this.prisma.user.findMany({
            where: { farmId },
            select: USER_SELECT,
            orderBy: { firstName: 'asc' },
        });
    }
    async findOne(id, farmId) {
        const where = farmId ? { id, farmId } : { id };
        const user = await this.prisma.user.findFirst({ where, select: USER_SELECT });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
        return user;
    }
    async update(id, farmId, dto) {
        await this.findOne(id, farmId);
        if (dto.email) {
            const existing = await this.prisma.user.findFirst({ where: { email: dto.email, NOT: { id } } });
            if (existing)
                throw new common_1.ConflictException('Ya existe otro usuario con ese email');
        }
        if (dto.username) {
            const existing = await this.prisma.user.findFirst({ where: { username: dto.username, NOT: { id } } });
            if (existing)
                throw new common_1.ConflictException(`El usuario "@${dto.username}" ya está en uso`);
        }
        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: USER_SELECT,
        });
    }
    async changePassword(id, farmId, dto) {
        const where = farmId ? { id, farmId } : { id };
        const user = await this.prisma.user.findFirst({ where });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid)
            throw new common_1.UnauthorizedException('La contraseña actual es incorrecta');
        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({ where: { id }, data: { password: hashed } });
        return { message: 'Contraseña actualizada correctamente' };
    }
    async remove(id, farmId, requestingRole) {
        const user = await this.findOne(id, farmId);
        if (user.role === client_1.UserRole.SUPER_ADMIN && requestingRole !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('No puedes eliminar un SUPER_ADMIN');
        }
        await this.prisma.user.delete({ where: { id } });
        return { message: 'Usuario eliminado correctamente' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map