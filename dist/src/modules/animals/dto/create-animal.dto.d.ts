import { AnimalSex, AnimalStatus } from '@prisma/client';
export declare class CreateAnimalDto {
    tagNumber: string;
    name?: string;
    sex: AnimalSex;
    birthDate?: string;
    birthWeight?: number;
    currentWeight?: number;
    photoUrl?: string;
    status?: AnimalStatus;
    notes?: string;
    breedId?: string;
    fatherId?: string;
    motherId?: string;
}
