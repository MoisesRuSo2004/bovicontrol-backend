import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { QueryAnimalDto } from './dto/query-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
export declare class AnimalsService {
    private readonly prisma;
    private readonly supabase;
    constructor(prisma: PrismaService, supabase: SupabaseService);
    create(farmId: string, dto: CreateAnimalDto): Promise<{
        breed: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string | null;
            name: string;
            species: string;
            origin: string | null;
            description: string | null;
            isGlobal: boolean;
        } | null;
        father: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
        mother: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
    } & {
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
    }>;
    findAll(farmId: string, query: QueryAnimalDto): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        breed: {
            id: string;
            name: string;
        } | null;
        father: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
        mother: {
            id: string;
            name: string | null;
            tagNumber: string;
        } | null;
    } & {
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
    }>>;
    getCategorySummary(farmId: string): Promise<{
        total: number;
        categories: {
            key: string;
            count: number;
        }[];
        animals: {
            id: string;
            tagNumber: string;
            name: string | null;
            sex: import("@prisma/client").$Enums.AnimalSex;
            ageMonths: number | null;
            currentWeight: number | null;
            photoUrl: string | null;
            breedName: string | null;
            category: string;
        }[];
    }>;
    findOne(id: string, farmId: string): Promise<{
        breed: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string | null;
            name: string;
            species: string;
            origin: string | null;
            description: string | null;
            isGlobal: boolean;
        } | null;
        _count: {
            vaccinations: number;
            reproductiveEventsAsFemale: number;
            pregnanciesAsFemale: number;
            treatments: number;
            milkRecords: number;
            weightRecords: number;
        };
        father: {
            id: string;
            name: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
        } | null;
        fatherOf: {
            id: string;
            name: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
            status: import("@prisma/client").$Enums.AnimalStatus;
        }[];
        mother: {
            id: string;
            name: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
        } | null;
        motherOf: {
            id: string;
            name: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
            status: import("@prisma/client").$Enums.AnimalStatus;
        }[];
    } & {
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
    }>;
    update(id: string, farmId: string, dto: UpdateAnimalDto): Promise<{
        breed: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string | null;
            name: string;
            species: string;
            origin: string | null;
            description: string | null;
            isGlobal: boolean;
        } | null;
    } & {
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
    }>;
    remove(id: string, farmId: string): Promise<{
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
    }>;
    updatePhoto(id: string, farmId: string, buffer: Buffer, mimetype: string, originalName: string): Promise<{
        breed: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string | null;
            name: string;
            species: string;
            origin: string | null;
            description: string | null;
            isGlobal: boolean;
        } | null;
        father: {
            id: string;
            name: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
        } | null;
        mother: {
            id: string;
            name: string | null;
            tagNumber: string;
            sex: import("@prisma/client").$Enums.AnimalSex;
        } | null;
    } & {
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
    }>;
    removePhoto(id: string, farmId: string): Promise<void>;
    getGallery(id: string, farmId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        animalId: string;
    }[]>;
    addGalleryPhoto(id: string, farmId: string, buffer: Buffer, mimetype: string, originalName: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        animalId: string;
    }>;
    removeGalleryPhoto(id: string, farmId: string, photoId: string): Promise<void>;
    getStats(farmId: string): Promise<{
        total: number;
        active: number;
        females: number;
        males: number;
        pregnancies: number;
        bySex: (Prisma.PickEnumerable<Prisma.AnimalGroupByOutputType, "sex"[]> & {
            _count: number;
        })[];
        byStatus: (Prisma.PickEnumerable<Prisma.AnimalGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
    }>;
}
