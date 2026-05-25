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
exports.AdminService = exports.CreateClientDto = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
const create_client_dto_1 = require("./dto/create-client.dto");
Object.defineProperty(exports, "CreateClientDto", { enumerable: true, get: function () { return create_client_dto_1.CreateClientDto; } });
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listFarms() {
        const farms = await this.prisma.farm.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                location: true,
                department: true,
                phone: true,
                email: true,
                isActive: true,
                subscriptionEndsAt: true,
                notes: true,
                createdAt: true,
                _count: { select: { animals: true, users: true } },
                users: {
                    select: { id: true, firstName: true, lastName: true, email: true, username: true, role: true, isActive: true, lastLoginAt: true },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        const now = new Date();
        return farms.map((f) => ({
            ...f,
            subscriptionStatus: this.calcStatus(f.isActive, f.subscriptionEndsAt, now),
            daysLeft: f.subscriptionEndsAt
                ? Math.ceil((f.subscriptionEndsAt.getTime() - now.getTime()) / 86_400_000)
                : null,
        }));
    }
    async createClient(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException(`Ya existe un usuario con el email ${dto.email}`);
        if (dto.username) {
            const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
            if (existingUsername)
                throw new common_1.ConflictException(`El usuario "${dto.username}" ya está en uso`);
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const subscriptionEndsAt = dto.subscriptionMonths
            ? new Date(Date.now() + dto.subscriptionMonths * 30 * 24 * 60 * 60 * 1000)
            : null;
        return this.prisma.$transaction(async (tx) => {
            const farm = await tx.farm.create({
                data: {
                    name: dto.farmName,
                    location: dto.farmLocation,
                    department: dto.farmDepartment,
                    phone: dto.farmPhone,
                    email: dto.farmEmail,
                    notes: dto.farmNotes,
                    subscriptionEndsAt,
                },
            });
            const user = await tx.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    username: dto.username || undefined,
                    password: hashedPassword,
                    phone: dto.phone,
                    role: 'ADMIN',
                    farmId: farm.id,
                },
                select: {
                    id: true, email: true, username: true, firstName: true, lastName: true, role: true, farmId: true,
                },
            });
            return { farm, user };
        });
    }
    async updateSubscription(farmId, months, notes) {
        const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
        if (!farm)
            throw new common_1.NotFoundException(`Finca ${farmId} no encontrada`);
        let subscriptionEndsAt = null;
        if (months !== null) {
            const now = new Date();
            const base = farm.subscriptionEndsAt && farm.subscriptionEndsAt > now
                ? farm.subscriptionEndsAt
                : now;
            subscriptionEndsAt = new Date(base.getTime() + months * 30 * 24 * 60 * 60 * 1000);
        }
        return this.prisma.farm.update({
            where: { id: farmId },
            data: {
                subscriptionEndsAt,
                ...(notes !== undefined && { notes }),
            },
            select: {
                id: true, name: true, isActive: true, subscriptionEndsAt: true, notes: true,
            },
        });
    }
    async toggleFarm(farmId, isActive) {
        const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
        if (!farm)
            throw new common_1.NotFoundException(`Finca ${farmId} no encontrada`);
        return this.prisma.farm.update({
            where: { id: farmId },
            data: { isActive },
            select: { id: true, name: true, isActive: true, subscriptionEndsAt: true },
        });
    }
    async toggleUser(userId, isActive) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario ${userId} no encontrado`);
        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive },
            select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
        });
    }
    async getStats() {
        const now = new Date();
        const [totalFarms, activeFarms, expiredFarms, totalAnimals] = await Promise.all([
            this.prisma.farm.count(),
            this.prisma.farm.count({ where: { isActive: true, OR: [{ subscriptionEndsAt: null }, { subscriptionEndsAt: { gt: now } }] } }),
            this.prisma.farm.count({ where: { isActive: true, subscriptionEndsAt: { lt: now } } }),
            this.prisma.animal.count({ where: { status: 'ACTIVE' } }),
        ]);
        return { totalFarms, activeFarms, expiredFarms, totalAnimals };
    }
    calcStatus(isActive, subscriptionEndsAt, now) {
        if (!isActive)
            return 'BLOCKED';
        if (!subscriptionEndsAt)
            return 'UNLIMITED';
        if (subscriptionEndsAt < now)
            return 'EXPIRED';
        const days = Math.ceil((subscriptionEndsAt.getTime() - now.getTime()) / 86_400_000);
        if (days <= 7)
            return 'EXPIRING_SOON';
        return 'ACTIVE';
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map