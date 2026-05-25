import { AnimalSex, AnimalStatus } from '@prisma/client';
export declare class QueryAnimalDto {
    page?: number;
    limit?: number;
    status?: AnimalStatus;
    sex?: AnimalSex;
    breedId?: string;
    search?: string;
}
