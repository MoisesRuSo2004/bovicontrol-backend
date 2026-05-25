import { PregnancyStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { CreateReproductiveEventDto } from './dto/create-reproductive-event.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
export declare class ReproductionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validateAnimal;
    createEvent(farmId: string, dto: CreateReproductiveEventDto): Promise<{
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        type: import("@prisma/client").$Enums.ReproductiveEventType;
        femaleId: string;
        maleId: string | null;
        eventDate: Date;
        bullSemen: string | null;
        technicianName: string | null;
    }>;
    findAllEvents(farmId: string, femaleId?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        type: import("@prisma/client").$Enums.ReproductiveEventType;
        femaleId: string;
        maleId: string | null;
        eventDate: Date;
        bullSemen: string | null;
        technicianName: string | null;
    }>>;
    findOneEvent(id: string, farmId: string): Promise<{
        female: {
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
        type: import("@prisma/client").$Enums.ReproductiveEventType;
        femaleId: string;
        maleId: string | null;
        eventDate: Date;
        bullSemen: string | null;
        technicianName: string | null;
    }>;
    removeEvent(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        type: import("@prisma/client").$Enums.ReproductiveEventType;
        femaleId: string;
        maleId: string | null;
        eventDate: Date;
        bullSemen: string | null;
        technicianName: string | null;
    }>;
    createPregnancy(farmId: string, dto: CreatePregnancyDto): Promise<{
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.PregnancyStatus;
        conceptionDate: Date;
        expectedBirthDate: Date;
        actualBirthDate: Date | null;
        gestationDays: number | null;
        offspringCount: number;
        femaleId: string;
        maleId: string | null;
        offspringId: string | null;
    }>;
    findAllPregnancies(farmId: string, femaleId?: string, status?: PregnancyStatus, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.PregnancyStatus;
        conceptionDate: Date;
        expectedBirthDate: Date;
        actualBirthDate: Date | null;
        gestationDays: number | null;
        offspringCount: number;
        femaleId: string;
        maleId: string | null;
        offspringId: string | null;
    }>>;
    findOnePregnancy(id: string, farmId: string): Promise<{
        female: {
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
        status: import("@prisma/client").$Enums.PregnancyStatus;
        conceptionDate: Date;
        expectedBirthDate: Date;
        actualBirthDate: Date | null;
        gestationDays: number | null;
        offspringCount: number;
        femaleId: string;
        maleId: string | null;
        offspringId: string | null;
    }>;
    updatePregnancy(id: string, farmId: string, dto: UpdatePregnancyDto): Promise<{
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.PregnancyStatus;
        conceptionDate: Date;
        expectedBirthDate: Date;
        actualBirthDate: Date | null;
        gestationDays: number | null;
        offspringCount: number;
        femaleId: string;
        maleId: string | null;
        offspringId: string | null;
    }>;
    getUpcomingBirths(farmId: string, daysAhead?: number): Promise<({
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.PregnancyStatus;
        conceptionDate: Date;
        expectedBirthDate: Date;
        actualBirthDate: Date | null;
        gestationDays: number | null;
        offspringCount: number;
        femaleId: string;
        maleId: string | null;
        offspringId: string | null;
    })[]>;
    updateEvent(id: string, farmId: string, dto: Partial<CreateReproductiveEventDto>): Promise<{
        female: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        type: import("@prisma/client").$Enums.ReproductiveEventType;
        femaleId: string;
        maleId: string | null;
        eventDate: Date;
        bullSemen: string | null;
        technicianName: string | null;
    }>;
    deletePregnancy(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.PregnancyStatus;
        conceptionDate: Date;
        expectedBirthDate: Date;
        actualBirthDate: Date | null;
        gestationDays: number | null;
        offspringCount: number;
        femaleId: string;
        maleId: string | null;
        offspringId: string | null;
    }>;
}
