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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Ya existe un usuario con este email');
        const farm = await this.prisma.farm.findUnique({ where: { id: dto.farmId } });
        if (!farm)
            throw new common_1.BadRequestException('La finca especificada no existe');
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password: hashedPassword,
                phone: dto.phone,
                role: dto.role,
                farmId: dto.farmId,
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, farmId: true },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.farmId);
        return { user, ...tokens };
    }
    async registerWithFarm(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Ya existe un usuario registrado con ese email');
        if (dto.farmRut) {
            const existingFarm = await this.prisma.farm.findUnique({ where: { rut: dto.farmRut } });
            if (existingFarm)
                throw new common_1.ConflictException(`Ya existe una finca con el NIT/RUT ${dto.farmRut}`);
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.$transaction(async (tx) => {
            const farm = await tx.farm.create({
                data: {
                    name: dto.farmName,
                    location: dto.farmLocation,
                    department: dto.farmDepartment,
                    municipality: dto.farmMunicipality,
                    areaHectares: dto.farmAreaHectares,
                    phone: dto.farmPhone,
                    email: dto.farmEmail,
                    rut: dto.farmRut,
                },
            });
            return tx.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    password: hashedPassword,
                    phone: dto.phone,
                    role: 'ADMIN',
                    farmId: farm.id,
                },
                select: { id: true, email: true, firstName: true, lastName: true, role: true, farmId: true },
            });
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.farmId);
        return { user, ...tokens };
    }
    async login(dto) {
        const loginValue = dto.login.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: { equals: loginValue, mode: 'insensitive' } },
                    { username: { equals: loginValue, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                firstName: true,
                lastName: true,
                role: true,
                farmId: true,
                isActive: true,
                farm: { select: { isActive: true, subscriptionEndsAt: true } },
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Tu cuenta está desactivada. Contacta al administrador.');
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (user.role !== 'SUPER_ADMIN') {
            if (!user.farm?.isActive) {
                throw new common_1.UnauthorizedException('Tu finca está desactivada. Contacta a BoviControl.');
            }
            if (user.farm?.subscriptionEndsAt && user.farm.subscriptionEndsAt < new Date()) {
                throw new common_1.UnauthorizedException(`Tu suscripción venció el ${user.farm.subscriptionEndsAt.toLocaleDateString('es-CO')}. Contacta a BoviControl para renovar.`);
            }
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const { password: _, ...userWithoutPassword } = user;
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.farmId);
        return { user: userWithoutPassword, ...tokens };
    }
    async refreshTokens(refreshToken) {
        const storedToken = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token inválido o expirado');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: storedToken.userId },
            select: { id: true, email: true, role: true, farmId: true, isActive: true },
        });
        if (!user || !user.isActive)
            throw new common_1.UnauthorizedException('Usuario no válido');
        await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
        return this.generateTokens(user.id, user.email, user.role, user.farmId);
    }
    async logout(refreshToken) {
        await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        return { message: 'Sesión cerrada correctamente' };
    }
    async generateTokens(userId, email, role, farmId) {
        const payload = { sub: userId, email, role, farmId: farmId ?? undefined };
        const refreshExpiresInVal = this.configService.get('jwt.refreshExpiresIn');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('jwt.refreshSecret'),
                expiresIn: refreshExpiresInVal,
            }),
        ]);
        const refreshExpiresIn = refreshExpiresInVal || '7d';
        const days = parseInt(refreshExpiresIn.replace('d', ''), 10);
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt } });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map