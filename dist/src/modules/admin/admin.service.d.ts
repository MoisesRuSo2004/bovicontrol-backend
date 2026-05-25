import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
export { CreateClientDto };
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listFarms(): Promise<{
        subscriptionStatus: string;
        daysLeft: number | null;
        id: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        name: string;
        location: string | null;
        department: string | null;
        subscriptionEndsAt: Date | null;
        notes: string | null;
        users: {
            id: string;
            email: string;
            username: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            lastLoginAt: Date | null;
        }[];
        _count: {
            users: number;
            animals: number;
        };
    }[]>;
    createClient(dto: CreateClientDto): Promise<{
        farm: {
            id: string;
            email: string | null;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            rut: string | null;
            location: string | null;
            department: string | null;
            municipality: string | null;
            areaHectares: number | null;
            subscriptionEndsAt: Date | null;
            notes: string | null;
        };
        user: {
            id: string;
            email: string;
            username: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            farmId: string | null;
        };
    }>;
    updateSubscription(farmId: string, months: number | null, notes?: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        subscriptionEndsAt: Date | null;
        notes: string | null;
    }>;
    toggleFarm(farmId: string, isActive: boolean): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        subscriptionEndsAt: Date | null;
    }>;
    toggleUser(userId: string, isActive: boolean): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
    }>;
    getStats(): Promise<{
        totalFarms: number;
        activeFarms: number;
        expiredFarms: number;
        totalAnimals: number;
    }>;
    private calcStatus;
}
