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
import { CostCategory } from '@prisma/client';

export class CreateOperationalCostDto {
  @ApiProperty({ enum: CostCategory, description: 'Categoría del costo' })
  @IsEnum(CostCategory)
  category: CostCategory;

  @ApiProperty({ example: 'Compra de concentrado 40kg', description: 'Descripción del costo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  description: string;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha del gasto' })
  @IsDateString()
  costDate: string;

  @ApiProperty({ example: 450000, description: 'Monto en COP' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: 'Distribuidora Agropecuaria SA', description: 'Proveedor' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  supplier?: string;

  @ApiPropertyOptional({ example: 'Factura #456', description: 'Referencia de la factura' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @ApiPropertyOptional({ description: 'ID del usuario que registró el costo' })
  @IsOptional()
  @IsUUID()
  registeredById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
