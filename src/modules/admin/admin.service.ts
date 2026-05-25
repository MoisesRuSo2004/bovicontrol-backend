import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

export { CreateClientDto };

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Listar todas las fincas con estado ──────────────────────────────────────

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

  // ─── Crear finca + usuario admin (el cliente) ─────────────────────────────────

  async createClient(dto: CreateClientDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException(`Ya existe un usuario con el email ${dto.email}`);

    if (dto.username) {
      const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
      if (existingUsername) throw new ConflictException(`El usuario "${dto.username}" ya está en uso`);
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

  // ─── Actualizar suscripción de una finca ──────────────────────────────────────

  async updateSubscription(farmId: string, months: number | null, notes?: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException(`Finca ${farmId} no encontrada`);

    let subscriptionEndsAt: Date | null = null;
    if (months !== null) {
      // Si aún tiene tiempo, extender desde la fecha actual de vencimiento (si no ha vencido)
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

  // ─── Activar / desactivar finca ───────────────────────────────────────────────

  async toggleFarm(farmId: string, isActive: boolean) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException(`Finca ${farmId} no encontrada`);
    return this.prisma.farm.update({
      where: { id: farmId },
      data: { isActive },
      select: { id: true, name: true, isActive: true, subscriptionEndsAt: true },
    });
  }

  // ─── Activar / desactivar usuario ─────────────────────────────────────────────

  async toggleUser(userId: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Usuario ${userId} no encontrado`);
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    });
  }

  // ─── Estadísticas generales ───────────────────────────────────────────────────

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

  // ─── Helper ───────────────────────────────────────────────────────────────────

  private calcStatus(isActive: boolean, subscriptionEndsAt: Date | null, now: Date): string {
    if (!isActive) return 'BLOCKED';
    if (!subscriptionEndsAt) return 'UNLIMITED';
    if (subscriptionEndsAt < now) return 'EXPIRED';
    const days = Math.ceil((subscriptionEndsAt.getTime() - now.getTime()) / 86_400_000);
    if (days <= 7) return 'EXPIRING_SOON';
    return 'ACTIVE';
  }
}
