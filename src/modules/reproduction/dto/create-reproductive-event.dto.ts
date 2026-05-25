import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ReproductiveEventType } from '@prisma/client';

export class CreateReproductiveEventDto {
  @ApiProperty({ description: 'ID de la hembra a la que pertenece el evento' })
  @IsUUID()
  femaleId: string;

  @ApiPropertyOptional({ description: 'ID del toro utilizado (para monta o IA)' })
  @IsOptional()
  @IsUUID()
  maleId?: string;

  @ApiProperty({ enum: ReproductiveEventType, description: 'Tipo de evento reproductivo' })
  @IsEnum(ReproductiveEventType)
  type: ReproductiveEventType;

  @ApiProperty({ example: '2024-06-01', description: 'Fecha del evento (ISO 8601)' })
  @IsDateString()
  eventDate: string;

  @ApiPropertyOptional({ example: 'Sin complicaciones' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ example: 'Pajilla congelada lote A-12', description: 'Información de semen usado en IA' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bullSemen?: string;

  @ApiPropertyOptional({ example: 'Dr. López', description: 'Nombre del técnico o veterinario' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  technicianName?: string;
}
