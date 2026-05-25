import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentFrequency } from '@prisma/client';
import { paginate, getPaginationParams } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMilkRecordDto } from './dto/create-milk-record.dto';
import { CreateMilkSaleDto } from './dto/create-milk-sale.dto';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpsertDairyConfigDto } from './dto/upsert-dairy-config.dto';

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateAnimal(animalId: string, farmId: string) {
    const animal = await this.prisma.animal.findFirst({ where: { id: animalId, farmId } });
    if (!animal) throw new NotFoundException(`Animal con id ${animalId} no encontrado en esta finca`);
    return animal;
  }

  // ─── Milk Records ────────────────────────────────────────────────────────────

  async createMilkRecord(farmId: string, dto: CreateMilkRecordDto) {
    await this.validateAnimal(dto.animalId, farmId);
    const record = await this.prisma.milkRecord.create({
      data: { ...dto, recordDate: new Date(dto.recordDate) },
      include: { animal: { select: { id: true, tagNumber: true, name: true } } },
    });
    return record;
  }

  async findAllMilkRecords(farmId: string, animalId?: string, from?: string, to?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      animal: { farmId },
      ...(animalId && { animalId }),
      ...(from || to
        ? {
            recordDate: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.milkRecord.findMany({
        where,
        skip,
        take,
        orderBy: { recordDate: 'desc' },
        include: { animal: { select: { id: true, tagNumber: true, name: true } } },
      }),
      this.prisma.milkRecord.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneMilkRecord(id: string, farmId: string) {
    const record = await this.prisma.milkRecord.findFirst({
      where: { id, animal: { farmId } },
      include: { animal: true },
    });
    if (!record) throw new NotFoundException(`Registro de leche con id ${id} no encontrado`);
    return record;
  }

  async getMilkSummary(farmId: string, from: string, to: string) {
    const where: any = {
      animal: { farmId },
      recordDate: { gte: new Date(from), lte: new Date(to) },
    };

    const records = await this.prisma.milkRecord.findMany({
      where,
      select: { animalId: true, totalLiters: true, recordDate: true },
    });

    const totalLiters = records.reduce((sum, r) => sum + r.totalLiters, 0);
    const recordCount = records.length;
    const avgPerRecord = recordCount > 0 ? totalLiters / recordCount : 0;

    // Per animal aggregation
    const byAnimal = new Map<string, number>();
    for (const r of records) {
      byAnimal.set(r.animalId, (byAnimal.get(r.animalId) || 0) + r.totalLiters);
    }
    const animalCount = byAnimal.size;
    const avgPerAnimal = animalCount > 0 ? totalLiters / animalCount : 0;

    // Daily totals
    const byDay = new Map<string, number>();
    for (const r of records) {
      const day = r.recordDate.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) || 0) + r.totalLiters);
    }
    const dailyTotals = [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, liters]) => ({ date, liters: Math.round(liters * 100) / 100 }));

    return {
      period: { from, to },
      totalLiters: Math.round(totalLiters * 100) / 100,
      recordCount,
      avgLitersPerRecord: Math.round(avgPerRecord * 100) / 100,
      animalsWithRecords: animalCount,
      avgLitersPerAnimal: Math.round(avgPerAnimal * 100) / 100,
      dailyTotals,
    };
  }

  // ─── Weight Records ──────────────────────────────────────────────────────────

  async createWeightRecord(farmId: string, dto: CreateWeightRecordDto) {
    await this.validateAnimal(dto.animalId, farmId);
    const record = await this.prisma.weightRecord.create({
      data: { ...dto, recordDate: new Date(dto.recordDate) },
      include: { animal: { select: { id: true, tagNumber: true, name: true } } },
    });
    // Update animal's currentWeight
    await this.prisma.animal.update({
      where: { id: dto.animalId },
      data: { currentWeight: dto.weightKg },
    });
    return record;
  }

  async findAllWeightRecords(farmId: string, animalId?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      animal: { farmId },
      ...(animalId && { animalId }),
    };
    const [data, total] = await Promise.all([
      this.prisma.weightRecord.findMany({
        where,
        skip,
        take,
        orderBy: { recordDate: 'desc' },
        include: { animal: { select: { id: true, tagNumber: true, name: true } } },
      }),
      this.prisma.weightRecord.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneWeightRecord(id: string, farmId: string) {
    const record = await this.prisma.weightRecord.findFirst({
      where: { id, animal: { farmId } },
      include: { animal: true },
    });
    if (!record) throw new NotFoundException(`Registro de peso con id ${id} no encontrado`);
    return record;
  }

  async getWeightGainSummary(farmId: string, animalId: string) {
    await this.validateAnimal(animalId, farmId);
    const records = await this.prisma.weightRecord.findMany({
      where: { animalId, animal: { farmId } },
      orderBy: { recordDate: 'asc' },
      select: { recordDate: true, weightKg: true },
    });
    if (records.length < 2) return { records, gainKg: null, gainPerDay: null };
    const first = records[0];
    const last = records[records.length - 1];
    const gainKg = last.weightKg - first.weightKg;
    const daysDiff = Math.max(1, (last.recordDate.getTime() - first.recordDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      records,
      gainKg: Math.round(gainKg * 100) / 100,
      gainPerDay: Math.round((gainKg / daysDiff) * 100) / 100,
      daysTracked: Math.round(daysDiff),
    };
  }

  // ─── Dairy Config ─────────────────────────────────────────────────────────────

  async getDairyConfig(farmId: string) {
    const config = await this.prisma.dairyConfig.findUnique({ where: { farmId } });
    return config ?? {
      farmId,
      buyerName: null,
      pricePerLiter: 0,
      paymentFrequency: PaymentFrequency.MONTHLY,
      notes: null,
    };
  }

  async upsertDairyConfig(farmId: string, dto: UpsertDairyConfigDto) {
    return this.prisma.dairyConfig.upsert({
      where: { farmId },
      create: { farmId, ...dto },
      update: { ...dto },
    });
  }

  // ─── Milk Sales ───────────────────────────────────────────────────────────────

  async createMilkSale(farmId: string, dto: CreateMilkSaleDto) {
    return this.prisma.milkSale.create({
      data: { farmId, liters: dto.liters, notes: dto.notes, saleDate: new Date(dto.saleDate) },
    });
  }

  async updateMilkSale(id: string, farmId: string, dto: Partial<CreateMilkSaleDto>) {
    const sale = await this.prisma.milkSale.findFirst({ where: { id, farmId } });
    if (!sale) throw new NotFoundException(`Registro de leche con id ${id} no encontrado`);
    return this.prisma.milkSale.update({
      where: { id },
      data: {
        ...(dto.liters !== undefined && { liters: dto.liters }),
        ...(dto.saleDate && { saleDate: new Date(dto.saleDate) }),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      },
    });
  }

  async deleteMilkSale(id: string, farmId: string) {
    const sale = await this.prisma.milkSale.findFirst({ where: { id, farmId } });
    if (!sale) throw new NotFoundException(`Registro de leche con id ${id} no encontrado`);
    return this.prisma.milkSale.delete({ where: { id } });
  }

  async findAllMilkSales(farmId: string, from?: string, to?: string, page = 1, limit = 30) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      farmId,
      ...(from || to ? {
        saleDate: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.milkSale.findMany({ where, skip, take, orderBy: { saleDate: 'desc' } }),
      this.prisma.milkSale.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  /** Calcula el rango (from/to) del período al que pertenece una fecha `ref` */
  private getPeriodRange(freq: PaymentFrequency, ref: Date) {
    const d = new Date(ref);
    if (freq === PaymentFrequency.WEEKLY) {
      const day = d.getDay();
      const from = new Date(d); from.setDate(d.getDate() - day); from.setHours(0,0,0,0);
      const to   = new Date(from); to.setDate(from.getDate() + 6); to.setHours(23,59,59,999);
      return { from, to };
    }
    if (freq === PaymentFrequency.BIWEEKLY) {
      const day = d.getDate();
      const from = new Date(d.getFullYear(), d.getMonth(), day <= 15 ? 1 : 16);
      const to   = new Date(d.getFullYear(), d.getMonth(), day <= 15 ? 15 : new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(), 23, 59, 59);
      return { from, to };
    }
    // MONTHLY
    const from = new Date(d.getFullYear(), d.getMonth(), 1);
    const to   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    return { from, to };
  }

  async getMilkSalesSummary(farmId: string) {
    const config = await this.getDairyConfig(farmId);
    const now = new Date();

    const freq = (config.paymentFrequency ?? PaymentFrequency.MONTHLY) as PaymentFrequency;
    const current  = this.getPeriodRange(freq, now);

    // Período anterior
    const prevRef = new Date(current.from); prevRef.setDate(prevRef.getDate() - 1);
    const previous = this.getPeriodRange(freq, prevRef);

    const fetchSales = (from: Date, to: Date) =>
      this.prisma.milkSale.findMany({
        where: { farmId, saleDate: { gte: from, lte: to } },
        orderBy: { saleDate: 'asc' },
      });

    const [currentSales, previousSales] = await Promise.all([
      fetchSales(current.from, current.to),
      fetchSales(previous.from, previous.to),
    ]);

    const totalLiters  = (sales: typeof currentSales) => sales.reduce((s, r) => s + r.liters, 0);
    const price        = config.pricePerLiter ?? 0;

    const curLiters    = Math.round(totalLiters(currentSales)  * 100) / 100;
    const prevLiters   = Math.round(totalLiters(previousSales) * 100) / 100;
    const curEarnings  = Math.round(curLiters  * price * 100) / 100;
    const prevEarnings = Math.round(prevLiters * price * 100) / 100;
    const litersChange = prevLiters > 0 ? Math.round(((curLiters - prevLiters) / prevLiters) * 1000) / 10 : null;

    // Totales últimos 30 días para gráfica
    const thirtyAgo = new Date(now); thirtyAgo.setDate(now.getDate() - 29); thirtyAgo.setHours(0,0,0,0);
    const chart30 = await this.prisma.milkSale.findMany({
      where: { farmId, saleDate: { gte: thirtyAgo, lte: now } },
      orderBy: { saleDate: 'asc' },
    });

    // Agrupar por día
    const byDay = new Map<string, number>();
    chart30.forEach((r) => {
      const day = r.saleDate.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + r.liters);
    });
    const chartData = [...byDay.entries()].map(([date, liters]) => ({
      date,
      liters: Math.round(liters * 100) / 100,
    }));

    return {
      config,
      current: {
        from: current.from.toISOString().slice(0, 10),
        to:   current.to.toISOString().slice(0, 10),
        liters: curLiters,
        earnings: curEarnings,
        recordCount: currentSales.length,
      },
      previous: {
        from: previous.from.toISOString().slice(0, 10),
        to:   previous.to.toISOString().slice(0, 10),
        liters: prevLiters,
        earnings: prevEarnings,
        recordCount: previousSales.length,
      },
      litersChange,
      chartData,
    };
  }

  /** Devuelve los últimos `count` períodos COMPLETADOS con detalle de ventas */
  async getPastPeriods(farmId: string, count = 6) {
    const config = await this.getDairyConfig(farmId);
    const freq   = (config.paymentFrequency ?? PaymentFrequency.MONTHLY) as PaymentFrequency;
    const price  = config.pricePerLiter ?? 0;

    // Comenzar desde el día anterior al inicio del período actual
    const currentRange = this.getPeriodRange(freq, new Date());
    let ref = new Date(currentRange.from);
    ref.setDate(ref.getDate() - 1);

    const periods: {
      from: string; to: string;
      liters: number; earnings: number; recordCount: number; pricePerLiter: number;
      sales: { saleDate: string; liters: number; earnings: number; notes: string | null }[];
    }[] = [];

    for (let i = 0; i < count; i++) {
      const range = this.getPeriodRange(freq, ref);
      const sales = await this.prisma.milkSale.findMany({
        where: { farmId, saleDate: { gte: range.from, lte: range.to } },
        orderBy: { saleDate: 'asc' },
      });
      const totalL    = Math.round(sales.reduce((s, r) => s + r.liters, 0) * 100) / 100;
      const earnings  = Math.round(totalL * price * 100) / 100;

      periods.push({
        from: range.from.toISOString().slice(0, 10),
        to:   range.to.toISOString().slice(0, 10),
        liters: totalL,
        earnings,
        recordCount: sales.length,
        pricePerLiter: price,
        sales: sales.map((s) => ({
          saleDate: s.saleDate.toISOString().slice(0, 10),
          liters:   s.liters,
          earnings: Math.round(s.liters * price * 100) / 100,
          notes:    s.notes ?? null,
        })),
      });

      ref = new Date(range.from);
      ref.setDate(ref.getDate() - 1);
    }

    return { config, periods };
  }
}
