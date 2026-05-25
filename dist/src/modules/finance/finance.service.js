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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSale(farmId, dto) {
        if (dto.animalId) {
            const animal = await this.prisma.animal.findFirst({ where: { id: dto.animalId, farmId } });
            if (!animal)
                throw new common_1.NotFoundException(`Animal con id ${dto.animalId} no encontrado`);
        }
        return this.prisma.sale.create({
            data: { ...dto, farmId, saleDate: new Date(dto.saleDate) },
            include: { animal: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async findAllSales(farmId, type, from, to, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
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
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOneSale(id, farmId) {
        const sale = await this.prisma.sale.findFirst({
            where: { id, farmId },
            include: { animal: true },
        });
        if (!sale)
            throw new common_1.NotFoundException(`Venta con id ${id} no encontrada`);
        return sale;
    }
    async createCost(farmId, dto) {
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
    async findAllCosts(farmId, category, from, to, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
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
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOneCost(id, farmId) {
        const cost = await this.prisma.operationalCost.findFirst({ where: { id, farmId } });
        if (!cost)
            throw new common_1.NotFoundException(`Costo con id ${id} no encontrado`);
        return cost;
    }
    async createIncome(farmId, dto) {
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
    async findAllIncomes(farmId, category, from, to, page = 1, limit = 20) {
        const { skip, take } = (0, pagination_util_1.getPaginationParams)(page, limit);
        const where = {
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
        return (0, pagination_util_1.paginate)(data, total, page, limit);
    }
    async findOneIncome(id, farmId) {
        const income = await this.prisma.incomeRecord.findFirst({ where: { id, farmId } });
        if (!income)
            throw new common_1.NotFoundException(`Ingreso con id ${id} no encontrado`);
        return income;
    }
    async updateCost(id, farmId, dto) {
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
    async removeCost(id, farmId) {
        await this.findOneCost(id, farmId);
        return this.prisma.operationalCost.delete({ where: { id } });
    }
    async updateSale(id, farmId, dto) {
        await this.findOneSale(id, farmId);
        return this.prisma.sale.update({
            where: { id },
            data: { ...dto, ...(dto.saleDate && { saleDate: new Date(dto.saleDate) }) },
            include: { animal: { select: { id: true, tagNumber: true, name: true } } },
        });
    }
    async removeSale(id, farmId) {
        await this.findOneSale(id, farmId);
        return this.prisma.sale.delete({ where: { id } });
    }
    async updateIncome(id, farmId, dto) {
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
    async removeIncome(id, farmId) {
        await this.findOneIncome(id, farmId);
        return this.prisma.incomeRecord.delete({ where: { id } });
    }
    async getSummary(farmId, from, to) {
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
        const costsByCategory = await this.prisma.operationalCost.groupBy({
            by: ['category'],
            where: { farmId, costDate: { gte: dateFrom, lte: dateTo } },
            _sum: { amount: true },
            _count: true,
        });
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
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map