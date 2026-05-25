import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TreatmentStatus } from '@prisma/client';

export class CreateTreatmentDto {
  @ApiProperty({ description: 'ID del animal en tratamiento' })
  @IsUUID()
  animalId: string;

  @ApiProperty({ example: 'Mastitis aguda', description: 'Diagnóstico del tratamiento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  diagnosis: string;

  @ApiPropertyOptional({ description: 'ID del medicamento utilizado' })
  @IsOptional()
  @IsUUID()
  medicationId?: string;

  @ApiPropertyOptional({ description: 'ID del usuario que aplicó el tratamiento' })
  @IsOptional()
  @IsUUID()
  appliedById?: string;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha de inicio del tratamiento' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2024-06-17', description: 'Fecha de fin planificada' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 20.0, description: 'Dosis aplicada' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  dosage?: number;

  @ApiPropertyOptional({ example: 'ml', description: 'Unidad de dosificación' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosageUnit?: string;

  @ApiPropertyOptional({ example: 'Cada 24 horas por 5 días', description: 'Frecuencia de aplicación' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  frequency?: string;

  @ApiPropertyOptional({ enum: TreatmentStatus, default: TreatmentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(TreatmentStatus)
  status?: TreatmentStatus;

  @ApiPropertyOptional({ example: 'Buena respuesta al tratamiento' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
