import { SaleType } from '@prisma/client';
export declare class CreateSaleDto {
    type: SaleType;
    saleDate: string;
    quantity: number;
    unit?: string;
    unitPrice: number;
    totalAmount: number;
    animalId?: string;
    buyerName?: string;
    buyerContact?: string;
    invoiceNumber?: string;
    notes?: string;
}
