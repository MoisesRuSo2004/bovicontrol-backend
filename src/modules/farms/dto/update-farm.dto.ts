import { PartialType } from '@nestjs/swagger';
import { CreateFarmDto } from './create-farm.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFarmDto extends PartialType(CreateFarmDto) {
  @ApiPropertyOptional({ description: 'Estado activo de la finca' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
