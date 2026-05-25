import { ReproductiveEventType } from '@prisma/client';
export declare class CreateReproductiveEventDto {
    femaleId: string;
    maleId?: string;
    type: ReproductiveEventType;
    eventDate: string;
    notes?: string;
    bullSemen?: string;
    technicianName?: string;
}
