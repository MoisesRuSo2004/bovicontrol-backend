import { CreateFarmDto } from './create-farm.dto';
declare const UpdateFarmDto_base: import("@nestjs/common").Type<Partial<CreateFarmDto>>;
export declare class UpdateFarmDto extends UpdateFarmDto_base {
    isActive?: boolean;
}
export {};
