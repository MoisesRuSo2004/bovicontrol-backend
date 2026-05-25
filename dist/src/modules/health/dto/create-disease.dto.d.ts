import { DiseaseStatus } from '@prisma/client';
export declare class CreateDiseaseDto {
    animalId: string;
    name: string;
    description?: string;
    diagnosisDate: string;
    status?: DiseaseStatus;
    resolvedDate?: string;
    diagnosedById?: string;
    symptoms?: string;
    notes?: string;
}
