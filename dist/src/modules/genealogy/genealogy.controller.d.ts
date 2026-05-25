import { GenealogyService } from './genealogy.service';
export declare class GenealogyController {
    private readonly genealogyService;
    constructor(genealogyService: GenealogyService);
    getAnimalTree(animalId: string, farmId: string): Promise<import("./genealogy.service").AnimalNode>;
    getAncestors(animalId: string, farmId: string, generations?: string): Promise<{
        id: string;
        tagNumber: string;
        name: string | null;
        sex: string;
        generation: number;
    }[]>;
    getDescendants(animalId: string, farmId: string, generations?: string): Promise<{
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
