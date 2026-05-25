import { PregnancyStatus } from '@prisma/client';
export declare class CreatePregnancyDto {
    femaleId: string;
    maleId?: string;
    conceptionDate: string;
    expectedBirthDate: string;
    status?: PregnancyStatus;
    gestationDays?: number;
    offspringCount?: number;
    notes?: string;
}
