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
import { IncomeCategory } from '@prisma/client';

export class CreateIncomeRecordDto {
  @ApiProperty({ enum: IncomeCategory, description: 'Categoría del ingreso' })
  @IsEnum(IncomeCategory)
  category: IncomeCategory;

  @ApiProperty({ example: 'Venta de leche semana 23', description: 'Descripción del ingreso' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  description: string;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha del ingreso' })
  @IsDateString()
  incomeDate: string;

  @ApiProperty({ example: 1800000, description: 'Monto en COP' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'ID de la venta asociada' })
  @IsOptional()
  @IsUUID()
  saleId?: string;

  @ApiPropertyOptional({ example: 'Recibo #789' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @ApiPropertyOptional({ description: 'ID del usuario que registró el ingreso' })
  @IsOptional()
  @IsUUID()
  registeredById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
