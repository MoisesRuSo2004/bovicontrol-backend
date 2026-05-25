import { CostCategory, IncomeCategory, SaleType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncomeRecordDto } from './dto/create-income-record.dto';
import { CreateOperationalCostDto } from './dto/create-operational-cost.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class FinanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSale(farmId: string, dto: CreateSaleDto): Promise<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        type: import("@prisma/client").$Enums.SaleType;
        animalId: string | null;
        saleDate: Date;
        buyerName: string | null;
        quantity: number;
        unit: string | null;
        unitPrice: number;
        totalAmount: number;
        buyerContact: string | null;
        invoiceNumber: string | null;
    }>;
    findAllSales(farmId: string, type?: SaleType, from?: string, to?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        type: import("@prisma/client").$Enums.SaleType;
        animalId: string | null;
        saleDate: Date;
        buyerName: string | null;
        quantity: number;
        unit: string | null;
        unitPrice: number;
        totalAmount: number;
        buyerContact: string | null;
        invoiceNumber: string | null;
    }>>;
    findOneSale(id: string, farmId: string): Promise<{
        animal: {
            id: string;
            photoUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            farmId: string;
            name: string | null;
            notes: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
            birthDate: Date | null;
            birthWeight: number | null;
            currentWeight: number | null;
            status: import("@prisma/client").$Enums.AnimalStatus;
            breedId: string | null;
            fatherId: string | null;
            motherId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        type: import("@prisma/client").$Enums.SaleType;
        animalId: string | null;
        saleDate: Date;
        buyerName: string | null;
        quantity: number;
        unit: string | null;
        unitPrice: number;
        totalAmount: number;
        buyerContact: string | null;
        invoiceNumber: string | null;
    }>;
    createCost(farmId: string, dto: CreateOperationalCostDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.CostCategory;
        amount: number;
        costDate: Date;
        supplier: string | null;
        invoiceNumber: string | null;
    }>;
    findAllCosts(farmId: string, category?: CostCategory, from?: string, to?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.CostCategory;
        amount: number;
        costDate: Date;
        supplier: string | null;
        invoiceNumber: string | null;
    }>>;
    findOneCost(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.CostCategory;
        amount: number;
        costDate: Date;
        supplier: string | null;
        invoiceNumber: string | null;
    }>;
    createIncome(farmId: string, dto: CreateIncomeRecordDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.IncomeCategory;
        incomeDate: Date;
        amount: number;
        source: string | null;
    }>;
    findAllIncomes(farmId: string, category?: IncomeCategory, from?: string, to?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.IncomeCategory;
        incomeDate: Date;
        amount: number;
        source: string | null;
    }>>;
    findOneIncome(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.IncomeCategory;
        incomeDate: Date;
        amount: number;
        source: string | null;
    }>;
    updateCost(id: string, farmId: string, dto: Partial<CreateOperationalCostDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.CostCategory;
        amount: number;
        costDate: Date;
        supplier: string | null;
        invoiceNumber: string | null;
    }>;
    removeCost(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.CostCategory;
        amount: number;
        costDate: Date;
        supplier: string | null;
        invoiceNumber: string | null;
    }>;
    updateSale(id: string, farmId: string, dto: Partial<CreateSaleDto>): Promise<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        type: import("@prisma/client").$Enums.SaleType;
        animalId: string | null;
        saleDate: Date;
        buyerName: string | null;
        quantity: number;
        unit: string | null;
        unitPrice: number;
        totalAmount: number;
        buyerContact: string | null;
        invoiceNumber: string | null;
    }>;
    removeSale(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        type: import("@prisma/client").$Enums.SaleType;
        animalId: string | null;
        saleDate: Date;
        buyerName: string | null;
        quantity: number;
        unit: string | null;
        unitPrice: number;
        totalAmount: number;
        buyerContact: string | null;
        invoiceNumber: string | null;
    }>;
    updateIncome(id: string, farmId: string, dto: Partial<CreateIncomeRecordDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.IncomeCategory;
        incomeDate: Date;
        amount: number;
        source: string | null;
    }>;
    removeIncome(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        description: string;
        category: import("@prisma/client").$Enums.IncomeCategory;
        incomeDate: Date;
        amount: number;
        source: string | null;
    }>;
    getSummary(farmId: string, from: string, to: string): Promise<{
        period: {
            from: string;
            to: string;
        };
        totalSalesRevenue: number;
        totalOtherIncome: number;
        totalIncome: number;
        totalCosts: number;
        netProfit: number;
        profitMargin: string;
        salesCount: number;
        costsCount: number;
        costsByCategory: {
            category: import("@prisma/client").$Enums.CostCategory;
            total: number;
            count: number;
        }[];
        incomeByCategory: {
            category: import("@prisma/client").$Enums.IncomeCategory;
            total: number;
            count: number;
        }[];
    }>;
}
