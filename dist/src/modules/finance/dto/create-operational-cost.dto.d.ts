import { CostCategory } from '@prisma/client';
export declare class CreateOperationalCostDto {
    category: CostCategory;
    description: string;
    costDate: string;
    amount: number;
    supplier?: string;
    reference?: string;
    registeredById?: string;
    notes?: string;
}
