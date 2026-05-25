import { AlertType } from '@prisma/client';
export declare class CreateHealthAlertDto {
    animalId?: string;
    type: AlertType;
    title: string;
    description?: string;
    scheduledDate: string;
    isCompleted?: boolean;
}
