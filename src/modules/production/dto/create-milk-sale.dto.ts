import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMilkSaleDto {
  @ApiProperty({ example: '2025-05-22' })
  @IsDateString()
  saleDate: string;

  @ApiProperty({ example: 120.5, description: 'Litros vendidos' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  liters: number;

  @ApiPropertyOptional({ example: 'Recogida de la mañana' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
