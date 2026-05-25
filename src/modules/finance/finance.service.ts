import { Injectable, NotFoundException } from '@nestjs/common';
import { CostCategory, IncomeCategory, SaleType } from '@prisma/client';
import { paginate, getPaginationParams } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncomeRecordDto } from './dto/create-income-record.dto';
import { CreateOperationalCostDto } from './dto/create-operational-cost.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Sales ──────────────────────────────────────────────────────────────────

  async createSale(farmId: string, dto: CreateSaleDto) {
    if (dto.animalId) {
      const animal = await this.prisma.animal.findFirst({ where: { id: dto.animalId, farmId } });
      if (!animal) throw new NotFoundException(`Animal con id ${dto.animalId} no encontrado`);
    }
    return this.prisma.sale.create({
      data: { ...dto, farmId, saleDate: new Date(dto.saleDate) },
      include: { animal: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async findAllSales(farmId: string, type?: SaleType, from?: string, to?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      farmId,
      ...(type && { type }),
      ...(from || to
        ? { saleDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip,
        take,
        orderBy: { saleDate: 'desc' },
        include: { animal: { select: { id: true, tagNumber: true, name: true } } },
      }),
      this.prisma.sale.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneSale(id: string, farmId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, farmId },
      include: { animal: true },
    });
    if (!sale) throw new NotFoundException(`Venta con id ${id} no encontrada`);
    return sale;
  }

  // ─── Operational Costs ──────────────────────────────────────────────────────

  async createCost(farmId: string, dto: CreateOperationalCostDto) {
    // El modelo Prisma usa `invoiceNumber` no `reference`; `registeredById` no existe en el modelo
    const { reference, registeredById, ...rest } = dto;
    return this.prisma.operationalCost.create({
      data: {
        ...rest,
        farmId,
        costDate: new Date(dto.costDate),
        ...(reference && { invoiceNumber: reference }),
      },
    });
  }

  async findAllCosts(farmId: string, category?: CostCategory, from?: string, to?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      farmId,
      ...(category && { category }),
      ...(from || to
        ? { costDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.operationalCost.findMany({ where, skip, take, orderBy: { costDate: 'desc' } }),
      this.prisma.operationalCost.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneCost(id: string, farmId: string) {
    const cost = await this.prisma.operationalCost.findFirst({ where: { id, farmId } });
    if (!cost) throw new NotFoundException(`Costo con id ${id} no encontrado`);
    return cost;
  }

  // ─── Income Records ─────────────────────────────────────────────────────────

  async createIncome(farmId: string, dto: CreateIncomeRecordDto) {
    // El modelo usa `source` no `reference`; `saleId` y `registeredById` no existen en el modelo
    const { reference, saleId, registeredById, ...rest } = dto;
    return this.prisma.incomeRecord.create({
      data: {
        ...rest,
        farmId,
        incomeDate: new Date(dto.incomeDate),
        ...(reference && { source: reference }),
      },
    });
  }

  async findAllIncomes(farmId: string, category?: IncomeCategory, from?: string, to?: string, page = 1, limit = 20) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: any = {
      farmId,
      ...(category && { category }),
      ...(from || to
        ? { incomeDate: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.incomeRecord.findMany({ where, skip, take, orderBy: { incomeDate: 'desc' } }),
      this.prisma.incomeRecord.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneIncome(id: string, farmId: string) {
    const income = await this.prisma.incomeRecord.findFirst({ where: { id, farmId } });
    if (!income) throw new NotFoundException(`Ingreso con id ${id} no encontrado`);
    return income;
  }

  // ─── Financial Summary ──────────────────────────────────────────────────────

  // ─── Update / Delete ────────────────────────────────────────────────────────

  async updateCost(id: string, farmId: string, dto: Partial<CreateOperationalCostDto>) {
    await this.findOneCost(id, farmId);
    const { reference, registeredById, ...rest } = dto;
    return this.prisma.operationalCost.update({
      where: { id },
      data: {
        ...rest,
        ...(dto.costDate && { costDate: new Date(dto.costDate) }),
        ...(reference !== undefined && { invoiceNumber: reference ?? null }),
      },
    });
  }

  async removeCost(id: string, farmId: string) {
    await this.findOneCost(id, farmId);
    return this.prisma.operationalCost.delete({ where: { id } });
  }

  async updateSale(id: string, farmId: string, dto: Partial<CreateSaleDto>) {
    await this.findOneSale(id, farmId);
    return this.prisma.sale.update({
      where: { id },
      data: { ...dto, ...(dto.saleDate && { saleDate: new Date(dto.saleDate) }) },
      include: { animal: { select: { id: true, tagNumber: true, name: true } } },
    });
  }

  async removeSale(id: string, farmId: string) {
    await this.findOneSale(id, farmId);
    return this.prisma.sale.delete({ where: { id } });
  }

  async updateIncome(id: string, farmId: string, dto: Partial<CreateIncomeRecordDto>) {
    await this.findOneIncome(id, farmId);
    const { reference, saleId, registeredById, ...rest } = dto;
    return this.prisma.incomeRecord.update({
      where: { id },
      data: {
        ...rest,
        ...(dto.incomeDate && { incomeDate: new Date(dto.incomeDate) }),
        ...(reference !== undefined && { source: reference ?? null }),
      },
    });
  }

  async removeIncome(id: string, farmId: string) {
    await this.findOneIncome(id, farmId);
    return this.prisma.incomeRecord.delete({ where: { id } });
  }

  // ─── Financial Summary ──────────────────────────────────────────────────────

  async getSummary(farmId: string, from: string, to: string) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const [salesAgg, costsAgg, incomesAgg] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { farmId, saleDate: { gte: dateFrom, lte: dateTo } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.operationalCost.aggregate({
        where: { farmId, costDate: { gte: dateFrom, lte: dateTo } },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.incomeRecord.aggregate({
        where: { farmId, incomeDate: { gte: dateFrom, lte: dateTo } },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalSales = salesAgg._sum?.totalAmount ?? 0;
    const totalIncomeRecords = incomesAgg._sum?.amount ?? 0;
    const totalIncome = totalSales + totalIncomeRecords;
    const totalCosts = costsAgg._sum?.amount ?? 0;
    const netProfit = totalIncome - totalCosts;

    // Breakdown by cost category
    const costsByCategory = await this.prisma.operationalCost.groupBy({
      by: ['category'],
      where: { farmId, costDate: { gte: dateFrom, lte: dateTo } },
      _sum: { amount: true },
      _count: true,
    });

    // Breakdown by income category
    const incomeByCategory = await this.prisma.incomeRecord.groupBy({
      by: ['category'],
      where: { farmId, incomeDate: { gte: dateFrom, lte: dateTo } },
      _sum: { amount: true },
      _count: true,
    });

    return {
      period: { from, to },
      totalSalesRevenue: totalSales,
      totalOtherIncome: totalIncomeRecords,
      totalIncome,
      totalCosts,
      netProfit,
      profitMargin: totalIncome > 0 ? `${((netProfit / totalIncome) * 100).toFixed(2)}%` : '0%',
      salesCount: salesAgg._count,
      costsCount: costsAgg._count,
      costsByCategory: costsByCategory.map((c) => ({
        category: c.category,
        total: c._sum.amount ?? 0,
        count: c._count,
      })),
      incomeByCategory: incomeByCategory.map((i) => ({
        category: i.category,
        total: i._sum.amount ?? 0,
        count: i._count,
      })),
    };
  }
}
