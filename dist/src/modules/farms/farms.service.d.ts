import { PrismaService } from '../../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
export declare class FarmsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFarmDto): Promise<{
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
    }>;
    findAll(): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        name: string;
        rut: string | null;
        location: string | null;
        department: string | null;
        municipality: string | null;
        areaHectares: number | null;
        _count: {
            users: number;
            animals: number;
        };
    }[]>;
    findOne(id: string): Promise<{
        _count: {
            users: number;
            animals: number;
        };
    } & {
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
    }>;
    update(id: string, dto: UpdateFarmDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
