import { CreatePregnancyDto } from './create-pregnancy.dto';
declare const UpdatePregnancyDto_base: import("@nestjs/common").Type<Partial<CreatePregnancyDto>>;
export declare class UpdatePregnancyDto extends UpdatePregnancyDto_base {
    actualBirthDate?: string;
    calvingAnimalId?: string;
}
export {};
