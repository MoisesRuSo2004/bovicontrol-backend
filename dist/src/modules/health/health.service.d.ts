import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { CreateHealthAlertDto } from './dto/create-health-alert.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { TreatmentStatus } from '@prisma/client';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validateAnimal;
    createVaccine(dto: CreateVaccineDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        description: string | null;
        isGlobal: boolean;
        manufacturer: string | null;
        doseIntervalDays: number | null;
    }>;
    findAllVaccines(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        description: string | null;
        isGlobal: boolean;
        manufacturer: string | null;
        doseIntervalDays: number | null;
    }[]>;
    findOneVaccine(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        description: string | null;
        isGlobal: boolean;
        manufacturer: string | null;
        doseIntervalDays: number | null;
    }>;
    createMedication(dto: CreateMedicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        description: string | null;
        isGlobal: boolean;
        type: string | null;
        dosageUnit: string | null;
    }>;
    findAllMedications(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        description: string | null;
        isGlobal: boolean;
        type: string | null;
        dosageUnit: string | null;
    }[]>;
    findOneMedication(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string | null;
        name: string;
        description: string | null;
        isGlobal: boolean;
        type: string | null;
        dosageUnit: string | null;
    }>;
    createVaccination(farmId: string, dto: CreateVaccinationDto): Promise<{
        vaccine: {
            id: string;
            name: string;
        };
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
        appliedById: string | null;
        vaccineId: string;
        appliedDate: Date;
        nextDueDate: Date | null;
        doseMl: number | null;
        batchNumber: string | null;
    }>;
    findAllVaccinations(farmId: string, animalId?: string, from?: string, to?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        vaccine: {
            id: string;
            name: string;
        };
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
        appliedById: string | null;
        vaccineId: string;
        appliedDate: Date;
        nextDueDate: Date | null;
        doseMl: number | null;
        batchNumber: string | null;
    }>>;
    getUpcomingVaccinations(farmId: string, daysAhead?: number): Promise<({
        vaccine: {
            id: string;
            name: string;
        };
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
        appliedById: string | null;
        vaccineId: string;
        appliedDate: Date;
        nextDueDate: Date | null;
        doseMl: number | null;
        batchNumber: string | null;
    })[]>;
    findOneVaccination(id: string, farmId: string): Promise<{
        vaccine: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string | null;
            name: string;
            description: string | null;
            isGlobal: boolean;
            manufacturer: string | null;
            doseIntervalDays: number | null;
        };
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
        appliedById: string | null;
        vaccineId: string;
        appliedDate: Date;
        nextDueDate: Date | null;
        doseMl: number | null;
        batchNumber: string | null;
    }>;
    updateVaccination(id: string, farmId: string, dto: Partial<CreateVaccinationDto>): Promise<{
        vaccine: {
            id: string;
            name: string;
        };
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
        appliedById: string | null;
        vaccineId: string;
        appliedDate: Date;
        nextDueDate: Date | null;
        doseMl: number | null;
        batchNumber: string | null;
    }>;
    deleteVaccination(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        animalId: string;
        appliedById: string | null;
        vaccineId: string;
        appliedDate: Date;
        nextDueDate: Date | null;
        doseMl: number | null;
        batchNumber: string | null;
    }>;
    createTreatment(farmId: string, dto: CreateTreatmentDto): Promise<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
        medication: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TreatmentStatus;
        animalId: string;
        diagnosis: string;
        medicationId: string | null;
        appliedById: string | null;
        startDate: Date;
        endDate: Date | null;
        dosage: number | null;
        dosageUnit: string | null;
        frequency: string | null;
    }>;
    findAllTreatments(farmId: string, animalId?: string, status?: TreatmentStatus, from?: string, to?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
        medication: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TreatmentStatus;
        animalId: string;
        diagnosis: string;
        medicationId: string | null;
        appliedById: string | null;
        startDate: Date;
        endDate: Date | null;
        dosage: number | null;
        dosageUnit: string | null;
        frequency: string | null;
    }>>;
    findOneTreatment(id: string, farmId: string): Promise<{
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
        medication: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            farmId: string | null;
            name: string;
            description: string | null;
            isGlobal: boolean;
            type: string | null;
            dosageUnit: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TreatmentStatus;
        animalId: string;
        diagnosis: string;
        medicationId: string | null;
        appliedById: string | null;
        startDate: Date;
        endDate: Date | null;
        dosage: number | null;
        dosageUnit: string | null;
        frequency: string | null;
    }>;
    updateTreatment(id: string, farmId: string, data: Partial<CreateTreatmentDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TreatmentStatus;
        animalId: string;
        diagnosis: string;
        medicationId: string | null;
        appliedById: string | null;
        startDate: Date;
        endDate: Date | null;
        dosage: number | null;
        dosageUnit: string | null;
        frequency: string | null;
    }>;
    createDisease(farmId: string, dto: CreateDiseaseDto): Promise<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.DiseaseStatus;
        animalId: string;
        diagnosisDate: Date;
        resolvedDate: Date | null;
    }>;
    findAllDiseases(farmId: string, animalId?: string, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
        animal: {
            id: string;
            name: string | null;
            tagNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.DiseaseStatus;
        animalId: string;
        diagnosisDate: Date;
        resolvedDate: Date | null;
    }>>;
    findOneDisease(id: string, farmId: string): Promise<{
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
        name: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.DiseaseStatus;
        animalId: string;
        diagnosisDate: Date;
        resolvedDate: Date | null;
    }>;
    updateDisease(id: string, farmId: string, data: Partial<CreateDiseaseDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        notes: string | null;
        status: import("@prisma/client").$Enums.DiseaseStatus;
        animalId: string;
        diagnosisDate: Date;
        resolvedDate: Date | null;
    }>;
    createAlert(farmId: string, dto: CreateHealthAlertDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        description: string | null;
        type: import("@prisma/client").$Enums.AlertType;
        title: string;
        animalId: string | null;
        scheduledDate: Date;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    findAllAlerts(farmId: string, isCompleted?: boolean, page?: number, limit?: number): Promise<import("../../common/utils/pagination.util").PaginatedResult<{
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
        description: string | null;
        type: import("@prisma/client").$Enums.AlertType;
        title: string;
        animalId: string | null;
        scheduledDate: Date;
        isCompleted: boolean;
        completedAt: Date | null;
    }>>;
    getUpcomingAlerts(farmId: string, daysAhead?: number): Promise<({
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
        description: string | null;
        type: import("@prisma/client").$Enums.AlertType;
        title: string;
        animalId: string | null;
        scheduledDate: Date;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    resolveAlert(id: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        description: string | null;
        type: import("@prisma/client").$Enums.AlertType;
        title: string;
        animalId: string | null;
        scheduledDate: Date;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
}
