import { IncomeCategory } from '@prisma/client';
export declare class CreateIncomeRecordDto {
    category: IncomeCategory;
    description: string;
    incomeDate: string;
    amount: number;
    saleId?: string;
    reference?: string;
    registeredById?: string;
    notes?: string;
}
