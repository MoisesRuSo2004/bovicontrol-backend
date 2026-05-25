import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVaccineDto {
  @ApiProperty({ example: 'Aftosa bivalente', description: 'Nombre de la vacuna' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Laboratorio Vecol', description: 'Fabricante o laboratorio' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  manufacturer?: string;

  @ApiPropertyOptional({ example: 'Controla fiebre aftosa tipo A y O', description: 'Descripción y usos' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 180, description: 'Duración de la protección en días' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  durationDays?: number;

  @ApiPropertyOptional({ example: 2, description: 'Dosis en ml' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  doseMl?: number;

  @ApiPropertyOptional({ example: 'Subcutánea, en el pliegue de la babilla', description: 'Vía de administración' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  applicationRoute?: string;
}
