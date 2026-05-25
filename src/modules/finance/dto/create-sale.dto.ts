import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaleType } from '@prisma/client';

export class CreateSaleDto {
  @ApiProperty({ enum: SaleType, description: 'Tipo de venta' })
  @IsEnum(SaleType)
  type: SaleType;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha de la venta' })
  @IsDateString()
  saleDate: string;

  @ApiProperty({ example: 180, description: 'Cantidad vendida (litros, kg, unidades, etc.)' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: 'litros', description: 'Unidad de la cantidad' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @ApiProperty({ example: 1800, description: 'Precio unitario en COP' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 324000, description: 'Monto total de la venta en COP' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({ description: 'ID del animal vendido (para ventas de tipo ANIMAL)' })
  @IsOptional()
  @IsUUID()
  animalId?: string;

  @ApiPropertyOptional({ example: 'Comercializadora Lácteos del Norte', description: 'Nombre del comprador' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  buyerName?: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567', description: 'Contacto del comprador' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  buyerContact?: string;

  @ApiPropertyOptional({ example: 'Factura #1234', description: 'Número de factura' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
