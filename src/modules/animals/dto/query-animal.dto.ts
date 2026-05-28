import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AnimalSex, AnimalStatus } from '@prisma/client';

export class QueryAnimalDto {
  @ApiPropertyOptional({ default: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, description: 'Cantidad de resultados por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: AnimalStatus, description: 'Filtrar por estado' })
  @IsOptional()
  @IsEnum(AnimalStatus)
  status?: AnimalStatus;

  @ApiPropertyOptional({ enum: AnimalSex, description: 'Filtrar por sexo' })
  @IsOptional()
  @IsEnum(AnimalSex)
  sex?: AnimalSex;

  @ApiPropertyOptional({ description: 'Filtrar por ID de raza' })
  @IsOptional()
  @IsUUID()
  breedId?: string;

  @ApiPropertyOptional({ description: 'Buscar por número de arete o nombre' })
  @IsOptional()
  @IsString()
  search?: string;
}
