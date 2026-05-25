import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AlertType } from '@prisma/client';

export class CreateHealthAlertDto {
  @ApiPropertyOptional({ description: 'ID del animal relacionado (puede ser nulo para alertas generales)' })
  @IsOptional()
  @IsUUID()
  animalId?: string;

  @ApiProperty({ enum: AlertType, description: 'Tipo de alerta' })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ example: 'Vacuna Aftosa pendiente', description: 'Título de la alerta' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'La vacuna Aftosa del animal BCT-005 vence el 2024-07-01' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: '2024-07-01', description: 'Fecha en que se debe ejecutar la acción' })
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional({ default: false, description: '¿Alerta completada?' })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
