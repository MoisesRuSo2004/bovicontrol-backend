import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicationDto {
  @ApiProperty({ example: 'Oxitetraciclina 200mg/ml', description: 'Nombre del medicamento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Antibiótico de amplio espectro', description: 'Descripción' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'Antibiótico', description: 'Categoría o tipo de medicamento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'Laboratorio Bayer', description: 'Fabricante' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  manufacturer?: string;

  @ApiPropertyOptional({ example: 'Intramuscular profundo', description: 'Vía de administración' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  applicationRoute?: string;

  @ApiPropertyOptional({ example: 1.0, description: 'Dosis estándar en ml/kg' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  standardDose?: number;

  @ApiPropertyOptional({ example: 'ml/kg', description: 'Unidad de la dosis' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  doseUnit?: string;

  @ApiPropertyOptional({ example: 14, description: 'Período de retiro en días (carne/leche)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  withdrawalPeriodDays?: number;
}
