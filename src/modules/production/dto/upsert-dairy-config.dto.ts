import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentFrequency } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertDairyConfigDto {
  @ApiPropertyOptional({ example: 'Coolechera del Valle' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  buyerName?: string;

  @ApiPropertyOptional({ example: 1800 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerLiter?: number;

  @ApiPropertyOptional({ enum: PaymentFrequency })
  @IsOptional()
  @IsEnum(PaymentFrequency)
  paymentFrequency?: PaymentFrequency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
