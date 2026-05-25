import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { CreatePregnancyDto } from './create-pregnancy.dto';

export class UpdatePregnancyDto extends PartialType(CreatePregnancyDto) {
  @ApiPropertyOptional({ description: 'Fecha real de parto' })
  @IsOptional()
  @IsDateString()
  actualBirthDate?: string;

  @ApiPropertyOptional({ description: 'ID de la cría nacida' })
  @IsOptional()
  @IsUUID()
  calvingAnimalId?: string;
}
