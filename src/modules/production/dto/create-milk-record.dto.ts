import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMilkRecordDto {
  @ApiProperty({ description: 'ID del animal (vaca)' })
  @IsUUID()
  animalId: string;

  @ApiProperty({ example: '2024-06-10', description: 'Fecha del ordeño' })
  @IsDateString()
  recordDate: string;

  @ApiPropertyOptional({ example: 8.5, description: 'Litros producidos en la mañana' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  morningLiters?: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Litros producidos en la tarde' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  afternoonLiters?: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Litros producidos en la noche' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  eveningLiters?: number;

  @ApiProperty({ example: 18.5, description: 'Total de litros producidos' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalLiters: number;

  @ApiPropertyOptional({ example: 85, description: 'Puntaje de calidad (0-100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qualityScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
