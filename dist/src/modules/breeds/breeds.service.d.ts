import { PrismaService } from '../../prisma/prisma.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
export declare class BreedsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateBreedDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        species: string;
        origin: string | null;
        description: string | null;
        isGlobal: boolean;
    }>;
    findAll(): Promise<({
        _count: {
            animals: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        species: string;
        origin: string | null;
        description: string | null;
        isGlobal: boolean;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            animals: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        species: string;
        origin: string | null;
        description: string | null;
        isGlobal: boolean;
    }>;
    update(id: string, dto: UpdateBreedDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        species: string;
        origin: string | null;
        description: string | null;
        isGlobal: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        species: string;
        origin: string | null;
        description: string | null;
        isGlobal: boolean;
    }>;
}
