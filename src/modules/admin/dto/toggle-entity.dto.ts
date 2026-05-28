import { IsBoolean } from 'class-validator';

export class ToggleEntityDto {
  @IsBoolean()
  isActive: boolean;
}
