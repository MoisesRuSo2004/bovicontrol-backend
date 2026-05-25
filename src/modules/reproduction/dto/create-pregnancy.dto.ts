import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PregnancyStatus } from '@prisma/client';

export class CreatePregnancyDto {
  @ApiProperty({ description: 'ID de la hembra gestante' })
  @IsUUID()
  femaleId: string;

  @ApiPropertyOptional({ description: 'ID del macho (padre)' })
  @IsOptional()
  @IsUUID()
  maleId?: string;

  @ApiProperty({ example: '2024-06-15', description: 'Fecha de concepción confirmada' })
  @IsDateString()
  conceptionDate: string;

  @ApiProperty({ example: '2025-03-25', description: 'Fecha esperada de parto' })
  @IsDateString()
  expectedBirthDate: string;

  @ApiPropertyOptional({ enum: PregnancyStatus, default: PregnancyStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(PregnancyStatus)
  status?: PregnancyStatus;

  @ApiPropertyOptional({ example: 283, description: 'Días de gestación' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  gestationDays?: number;

  @ApiPropertyOptional({ example: 1, description: 'Número de crías esperadas' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  offspringCount?: number;

  @ApiPropertyOptional({ example: 'Preñez confirmada por ultrasonido a los 45 días' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
