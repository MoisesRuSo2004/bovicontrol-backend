import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { DiseaseStatus } from '@prisma/client';

export class CreateDiseaseDto {
  @ApiProperty({ description: 'ID del animal afectado' })
  @IsUUID()
  animalId: string;

  @ApiProperty({ example: 'Mastitis clínica', description: 'Nombre o diagnóstico de la enfermedad' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Mastitis en cuarto posterior derecho', description: 'Descripción detallada' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: '2024-06-08', description: 'Fecha de diagnóstico' })
  @IsDateString()
  diagnosisDate: string;

  @ApiPropertyOptional({ enum: DiseaseStatus, default: DiseaseStatus.ACTIVE })
  @IsOptional()
  @IsEnum(DiseaseStatus)
  status?: DiseaseStatus;

  @ApiPropertyOptional({ example: '2024-06-20', description: 'Fecha de resolución o cierre' })
  @IsOptional()
  @IsDateString()
  resolvedDate?: string;

  @ApiPropertyOptional({ description: 'ID del veterinario que realizó el diagnóstico' })
  @IsOptional()
  @IsUUID()
  diagnosedById?: string;

  @ApiPropertyOptional({ example: 'Signos: cuarto caliente, secreción anormal, fiebre 39.8°C' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  symptoms?: string;

  @ApiPropertyOptional({ example: 'Recuperación completa esperada en 10 días' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
