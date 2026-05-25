import { PaymentFrequency } from '@prisma/client';
export declare class UpsertDairyConfigDto {
    buyerName?: string;
    pricePerLiter?: number;
    paymentFrequency?: PaymentFrequency;
    notes?: string;
}
