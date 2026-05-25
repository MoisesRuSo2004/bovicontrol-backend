import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeightRecordDto {
  @ApiProperty({ description: 'ID del animal pesado' })
  @IsUUID()
  animalId: string;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha del pesaje' })
  @IsDateString()
  recordDate: string;

  @ApiProperty({ example: 380.0, description: 'Peso en kg' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weightKg: number;

  @ApiPropertyOptional({ example: 'Báscula digital marca Gallagher', description: 'Método o instrumento de pesaje' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  method?: string;

  @ApiPropertyOptional({ description: 'ID del operario que realizó el pesaje' })
  @IsOptional()
  @IsUUID()
  recordedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
