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

export class CreateVaccinationDto {
  @ApiProperty({ description: 'ID del animal vacunado' })
  @IsUUID()
  animalId: string;

  @ApiProperty({ description: 'ID de la vacuna aplicada' })
  @IsUUID()
  vaccineId: string;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha de aplicación' })
  @IsDateString()
  appliedDate: string;

  @ApiPropertyOptional({ example: '2024-12-10', description: 'Fecha de próxima dosis' })
  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @ApiPropertyOptional({ example: 2.0, description: 'Dosis aplicada en ml' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  doseMl?: number;

  @ApiPropertyOptional({ example: 'Lote 2024-A', description: 'Número de lote de la vacuna' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'ID del veterinario que aplicó la vacuna' })
  @IsOptional()
  @IsUUID()
  appliedById?: string;

  @ApiPropertyOptional({ example: 'Sin reacciones adversas' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
