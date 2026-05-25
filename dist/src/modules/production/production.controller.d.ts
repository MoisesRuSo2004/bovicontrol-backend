import { CreateMilkRecordDto } from './dto/create-milk-record.dto';
import { CreateMilkSaleDto } from './dto/create-milk-sale.dto';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpsertDairyConfigDto } from './dto/upsert-dairy-config.dto';
import { ProductionService } from './production.service';
export declare class ProductionController {
    private readonly productionService;
    constructor(productionService: ProductionService);
    getDairyConfig(farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        buyerName: string | null;
        pricePerLiter: number;
        paymentFrequency: import("@prisma/client").$Enums.PaymentFrequency;
    } | {
        farmId: string;
        buyerName: null;
        pricePerLiter: number;
        paymentFrequency: "MONTHLY";
        notes: null;
    }>;
    upsertDairyConfig(farmId: string, dto: UpsertDairyConfigDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        buyerName: string | null;
        pricePerLiter: number;
        paymentFrequency: import("@prisma/client").$Enums.PaymentFrequency;
    }>;
    getMilkSalesSummary(farmId: string): Promise<{
        config: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string;
            notes: string | null;
            buyerName: string | null;
            pricePerLiter: number;
            paymentFrequency: import("@prisma/client").$Enums.PaymentFrequency;
        } | {
            farmId: string;
            buyerName: null;
            pricePerLiter: number;
            paymentFrequency: "MONTHLY";
            notes: null;
        };
        current: {
            from: string;
            to: string;
            liters: number;
            earnings: number;
            recordCount: number;
        };
        previous: {
            from: string;
            to: string;
            liters: number;
            earnings: number;
            recordCount: number;
        };
        litersChange: number | null;
        chartData: {
            date: string;
            liters: number;
        }[];
    }>;
    getPastPeriods(farmId: string, count?: string): Promise<{
        config: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string;
            notes: string | null;
            buyerName: string | null;
            pricePerLiter: number;
            paymentFrequency: import("@prisma/client").$Enums.PaymentFrequency;
        } | {
            farmId: string;
            buyerName: null;
            pricePerLiter: number;
            paymentFrequency: "MONTHLY";
            notes: null;
        };
        periods: {
            from: string;
            to: string;
            liters: number;
            earnings: number;
            recordCount: number;
            pricePerLiter: number;
            sales: {
                saleDate: string;
                liters: number;
                earnings: number;
                notes: string | null;
            }[];
        }[];
    }>;
    findAllMilkSales(farmId: string, from?: string, to?: string, page?: string, limit?: string): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        saleDate: Date;
        liters: number;
    }>>;
    createMilkSale(farmId: string, dto: CreateMilkSaleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        saleDate: Date;
        liters: number;
    }>;
    updateMilkSale(id: string, farmId: string, dto: Partial<CreateMilkSaleDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        saleDate: Date;
        liters: number;
    }>;
    deleteMilkSale(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        notes: string | null;
        saleDate: Date;
        liters: number;
    }>;
    createMilkRecord(farmId: string, dto: CreateMilkRecordDto): Promise<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        animalId: string;
        recordDate: Date;
        morningLiters: number | null;
        afternoonLiters: number | null;
        eveningLiters: number | null;
        totalLiters: number;
        qualityScore: number | null;
    }>;
    findAllMilkRecords(farmId: string, animalId?: string, from?: string, to?: string, page?: string, limit?: string): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        animalId: string;
        recordDate: Date;
        morningLiters: number | null;
        afternoonLiters: number | null;
        eveningLiters: number | null;
        totalLiters: number;
        qualityScore: number | null;
    }>>;
    getMilkSummary(farmId: string, from: string, to: string): Promise<{
        period: {
            from: string;
            to: string;
        };
        totalLiters: number;
        recordCount: number;
        avgLitersPerRecord: number;
        animalsWithRecords: number;
        avgLitersPerAnimal: number;
        dailyTotals: {
            date: string;
            liters: number;
        }[];
    }>;
    findOneMilkRecord(id: string, farmId: string): Promise<{
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        animalId: string;
        recordDate: Date;
        morningLiters: number | null;
        afternoonLiters: number | null;
        eveningLiters: number | null;
        totalLiters: number;
        qualityScore: number | null;
    }>;
    createWeightRecord(farmId: string, dto: CreateWeightRecordDto): Promise<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        animalId: string;
        recordDate: Date;
        weightKg: number;
        method: string | null;
    }>;
    findAllWeightRecords(farmId: string, animalId?: string, page?: string, limit?: string): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        animalId: string;
        recordDate: Date;
        weightKg: number;
        method: string | null;
    }>>;
    getWeightGainSummary(animalId: string, farmId: string): Promise<{
        records: {
            recordDate: Date;
            weightKg: number;
        }[];
        gainKg: null;
        gainPerDay: null;
        daysTracked?: undefined;
    } | {
        records: {
            recordDate: Date;
            weightKg: number;
        }[];
        gainKg: number;
        gainPerDay: number;
        daysTracked: number;
    }>;
    findOneWeightRecord(id: string, farmId: string): Promise<{
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
        };
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        animalId: string;
        recordDate: Date;
        weightKg: number;
        method: string | null;
    }>;
}
