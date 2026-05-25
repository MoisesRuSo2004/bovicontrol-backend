import { Injectable, NotFoundException } from '@nestjs/common';
import { paginate, getPaginationParams } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';

export type AlertPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertType =
  | 'VACCINATION_DUE'
  | 'BIRTH_UPCOMING'
  | 'MISSING_MILK'
  | 'LOW_PRODUCTION'
  | 'REPRODUCTIVE_DELAY';

export interface SmartAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  animalId?: string;
  animalTag?: string;
  animalName?: string | null;
  daysUntil?: number;   // positive = upcoming, negative = overdue
}

export interface CreateNotificationDto {
  userId: string;
  farmId: string;
  title: string;
  message: string;
  type?: string;
  referenceId?: string;
  referenceType?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: { ...dto, type: dto.type ?? 'GENERAL' } });
  }

  async findAll(userId: string, farmId: string, isRead?: boolean, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where = {
      userId,
      farmId,
      ...(isRead !== undefined && { isRead }),
    };
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: string, userId: string, farmId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId, farmId },
    });
    if (!notification) throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    return notification;
  }

  async markAsRead(id: string, userId: string, farmId: string) {
    await this.findOne(id, userId, farmId);
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string, farmId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, farmId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: `${result.count} notificaciones marcadas como leídas` };
  }

  async getUnreadCount(userId: string, farmId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, farmId, isRead: false },
    });
    return { unreadCount: count };
  }

  async delete(id: string, userId: string, farmId: string) {
    await this.findOne(id, userId, farmId);
    return this.prisma.notification.delete({ where: { id } });
  }

  async deleteAllRead(userId: string, farmId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId, farmId, isRead: true },
    });
    return { message: `${result.count} notificaciones eliminadas` };
  }

  // ─── Smart Alerts Engine ────────────────────────────────────────────────────
  /**
   * Computes real-time smart alerts for a farm by querying live data.
   * No DB writes — purely computed from current state.
   */
  async generateAlerts(farmId: string): Promise<SmartAlert[]> {
    const alerts: SmartAlert[] = [];
    const now = new Date();

    // ── 1. VACCINATION_DUE ────────────────────────────────────────────────────
    // Vaccinations whose nextDueDate is within the next 7 days OR already overdue
    const vaccinations = await this.prisma.vaccination.findMany({
      where: {
        animal: { farmId, status: 'ACTIVE' },
        nextDueDate: {
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        nextDueDate: true,
        vaccine: { select: { name: true } },
        animal: { select: { id: true, tagNumber: true, name: true } },
      },
      orderBy: { nextDueDate: 'asc' },
    });

    for (const v of vaccinations) {
      if (!v.nextDueDate) continue;
      const days = Math.ceil(
        (v.nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const label = v.animal.name
        ? `${v.animal.name} (${v.animal.tagNumber})`
        : v.animal.tagNumber;
      const priority: AlertPriority = days <= 0 ? 'HIGH' : days <= 3 ? 'HIGH' : 'MEDIUM';
      const when = days <= 0
        ? `hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''} (vencida)`
        : days === 0
          ? 'hoy'
          : `en ${days} día${days !== 1 ? 's' : ''}`;

      alerts.push({
        id: `vac-${v.id}`,
        type: 'VACCINATION_DUE',
        priority,
        title: `Vacuna pendiente: ${v.vaccine.name}`,
        message: `${label} debe recibir ${v.vaccine.name} ${when}`,
        animalId: v.animal.id,
        animalTag: v.animal.tagNumber,
        animalName: v.animal.name,
        daysUntil: days,
      });
    }

    // ── 2. BIRTH_UPCOMING ─────────────────────────────────────────────────────
    // Pregnancies IN_PROGRESS with expectedBirthDate within next 14 days
    const pregnancies = await this.prisma.pregnancy.findMany({
      where: {
        status: 'IN_PROGRESS',
        female: { farmId, status: 'ACTIVE' },
        expectedBirthDate: {
          lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        expectedBirthDate: true,
        female: { select: { id: true, tagNumber: true, name: true } },
      },
      orderBy: { expectedBirthDate: 'asc' },
    });

    for (const p of pregnancies) {
      const days = Math.ceil(
        (p.expectedBirthDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const label = p.female.name
        ? `${p.female.name} (${p.female.tagNumber})`
        : p.female.tagNumber;
      const priority: AlertPriority = days <= 3 ? 'HIGH' : 'MEDIUM';
      const when = days <= 0
        ? 'hoy o ya pasó la fecha'
        : days === 1
          ? 'mañana'
          : `en ${days} días`;

      alerts.push({
        id: `preg-${p.id}`,
        type: 'BIRTH_UPCOMING',
        priority,
        title: `Parto próximo`,
        message: `${label} está próxima a parir (${when})`,
        animalId: p.female.id,
        animalTag: p.female.tagNumber,
        animalName: p.female.name,
        daysUntil: days,
      });
    }

    // ── 3. MISSING_MILK ───────────────────────────────────────────────────────
    // Cows that had at least one milk record in the last 30 days but NONE in last 3 days
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get female active animals that have had milk records in the last 30 days
    const dairyCows = await this.prisma.animal.findMany({
      where: {
        farmId,
        status: 'ACTIVE',
        sex: 'FEMALE',
        milkRecords: {
          some: { recordDate: { gte: thirtyDaysAgo } },
        },
      },
      select: {
        id: true,
        tagNumber: true,
        name: true,
        milkRecords: {
          where: { recordDate: { gte: threeDaysAgo } },
          select: { recordDate: true },
          orderBy: { recordDate: 'desc' },
          take: 1,
        },
      },
    });

    for (const cow of dairyCows) {
      if (cow.milkRecords.length === 0) {
        const label = cow.name ? `${cow.name} (${cow.tagNumber})` : cow.tagNumber;
        alerts.push({
          id: `milk-miss-${cow.id}`,
          type: 'MISSING_MILK',
          priority: 'MEDIUM',
          title: `Sin registro de leche`,
          message: `${label} lleva más de 3 días sin registro de producción`,
          animalId: cow.id,
          animalTag: cow.tagNumber,
          animalName: cow.name,
        });
      }
    }

    // ── 4. LOW_PRODUCTION ─────────────────────────────────────────────────────
    // Cows whose avg production last 7 days < 70% of the prior 7 days
    const sevenDaysAgo  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const productionCows = await this.prisma.animal.findMany({
      where: {
        farmId,
        status: 'ACTIVE',
        sex: 'FEMALE',
        milkRecords: {
          some: { recordDate: { gte: fourteenDaysAgo } },
        },
      },
      select: {
        id: true,
        tagNumber: true,
        name: true,
        milkRecords: {
          where: { recordDate: { gte: fourteenDaysAgo } },
          select: { recordDate: true, totalLiters: true },
        },
      },
    });

    for (const cow of productionCows) {
      const recent = cow.milkRecords.filter((r) => new Date(r.recordDate) >= sevenDaysAgo);
      const prior  = cow.milkRecords.filter((r) => new Date(r.recordDate) < sevenDaysAgo);

      if (recent.length < 3 || prior.length < 3) continue; // not enough data

      const avgRecent = recent.reduce((s, r) => s + r.totalLiters, 0) / recent.length;
      const avgPrior  = prior.reduce((s, r) => s + r.totalLiters, 0) / prior.length;

      if (avgPrior > 0 && avgRecent < avgPrior * 0.7) {
        const drop = Math.round((1 - avgRecent / avgPrior) * 100);
        const label = cow.name ? `${cow.name} (${cow.tagNumber})` : cow.tagNumber;
        alerts.push({
          id: `milk-low-${cow.id}`,
          type: 'LOW_PRODUCTION',
          priority: 'MEDIUM',
          title: `Baja producción de leche`,
          message: `${label} bajó un ${drop}% en producción (${avgRecent.toFixed(1)} L vs ${avgPrior.toFixed(1)} L promedio)`,
          animalId: cow.id,
          animalTag: cow.tagNumber,
          animalName: cow.name,
        });
      }
    }

    // ── 5. REPRODUCTIVE_DELAY ─────────────────────────────────────────────────
    // Adult females (≥24m) with no active pregnancy and last reproductive event > 90 days ago
    // (or never had one)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const twentyFourMonthsAgo = new Date(
      now.getFullYear() - 2, now.getMonth(), now.getDate(),
    );

    const femalesForRepro = await this.prisma.animal.findMany({
      where: {
        farmId,
        status: 'ACTIVE',
        sex: 'FEMALE',
        birthDate: { lte: twentyFourMonthsAgo }, // at least 24 months old
        pregnanciesAsFemale: { none: { status: 'IN_PROGRESS' } },
      },
      select: {
        id: true,
        tagNumber: true,
        name: true,
        reproductiveEventsAsFemale: {
          select: { eventDate: true },
          orderBy: { eventDate: 'desc' },
          take: 1,
        },
      },
    });

    for (const female of femalesForRepro) {
      const lastEvent = female.reproductiveEventsAsFemale[0];
      const isDelayed =
        !lastEvent || new Date(lastEvent.eventDate) < ninetyDaysAgo;

      if (isDelayed) {
        const label = female.name
          ? `${female.name} (${female.tagNumber})`
          : female.tagNumber;
        const daysSince = lastEvent
          ? Math.floor(
              (now.getTime() - new Date(lastEvent.eventDate).getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : null;
        const sinceMsg = daysSince
          ? `Hace ${daysSince} días sin actividad reproductiva`
          : 'Sin eventos reproductivos registrados';

        alerts.push({
          id: `repro-${female.id}`,
          type: 'REPRODUCTIVE_DELAY',
          priority: 'LOW',
          title: `Posible retraso reproductivo`,
          message: `${label}: ${sinceMsg}`,
          animalId: female.id,
          animalTag: female.tagNumber,
          animalName: female.name,
        });
      }
    }

    // Sort: HIGH first, then MEDIUM, then LOW; within same priority by type
    const PRIORITY_ORDER: Record<AlertPriority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    alerts.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

    return alerts;
  }

  /**
   * Internal helper used by other services to broadcast a notification to all
   * users of a farm that match the given roles (or all users if roles is empty).
   */
  async broadcastToFarm(farmId: string, title: string, message: string, type?: string, referenceId?: string, referenceType?: string) {
    const users = await this.prisma.user.findMany({
      where: { farmId, isActive: true },
      select: { id: true },
    });
    if (users.length === 0) return;

    await this.prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        farmId,
        title,
        message,
        type: type ?? 'GENERAL',
        referenceId,
        referenceType,
      })),
    });
  }
}
