import { PrismaService } from '../../prisma/prisma.service';
export interface AnimalNode {
    id: string;
    tagNumber: string;
    name: string | null;
    sex: string;
    birthDate: Date | null;
    photoUrl: string | null;
    breed: {
        id: string;
        name: string;
    } | null;
    father?: AnimalNode | null;
    mother?: AnimalNode | null;
}
export declare class GenealogyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getAnimalOrFail;
    getAnimalTree(id: string, farmId: string): Promise<AnimalNode>;
    private buildAncestorTree;
    getAncestors(id: string, farmId: string, generations?: number): Promise<{
        id: string;
        tagNumber: string;
        name: string | null;
        sex: string;
        generation: number;
    }[]>;
    getDescendants(id: string, farmId: string, generations?: number): Promise<{
        id: string;
        tagNumber: string;
        name: string | null;
        sex: string;
        photoUrl: string | null;
        generation: number;
        parentRole: string;
    }[]>;
    analyzeInbreeding(animalId: string, farmId: string): Promise<{
        animalId: string;
        inbreedingCoefficient: number;
        inbreedingPercentage: string;
        risk: string;
        commonAncestors: number;
        generationsAnalyzed: number;
        analysisId: string;
    }>;
    getInbreedingHistory(animalId: string, farmId: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        animalId: string;
        inbreedingCoefficient: number;
        analysisDate: Date;
        generationsAnalyzed: number;
    }[]>;
}
