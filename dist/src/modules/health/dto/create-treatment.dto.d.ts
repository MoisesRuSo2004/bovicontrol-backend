import { TreatmentStatus } from '@prisma/client';
export declare class CreateTreatmentDto {
    animalId: string;
    diagnosis: string;
    medicationId?: string;
    appliedById?: string;
    startDate: string;
    endDate?: string;
    dosage?: number;
    dosageUnit?: string;
    frequency?: string;
    status?: TreatmentStatus;
    notes?: string;
}
