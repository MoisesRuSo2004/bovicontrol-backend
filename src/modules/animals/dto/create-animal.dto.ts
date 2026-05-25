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
import { AnimalSex, AnimalStatus } from '@prisma/client';

export class CreateAnimalDto {
  @ApiProperty({ example: 'BCT-001', description: 'Número de arete / identificación' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tagNumber: string;

  @ApiPropertyOptional({ example: 'Lola', description: 'Nombre del animal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ enum: AnimalSex, description: 'Sexo del animal' })
  @IsEnum(AnimalSex)
  sex: AnimalSex;

  @ApiPropertyOptional({ example: '2022-03-15', description: 'Fecha de nacimiento (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 38.5, description: 'Peso al nacer en kg' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  birthWeight?: number;

  @ApiPropertyOptional({ example: 520.0, description: 'Peso actual en kg' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  currentWeight?: number;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...', description: 'URL de la foto del animal' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  photoUrl?: string;

  @ApiPropertyOptional({ enum: AnimalStatus, default: AnimalStatus.ACTIVE })
  @IsOptional()
  @IsEnum(AnimalStatus)
  status?: AnimalStatus;

  @ApiPropertyOptional({ example: 'Animal manso, buena productora' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'ID de la raza' })
  @IsOptional()
  @IsUUID()
  breedId?: string;

  @ApiPropertyOptional({ description: 'ID del padre (animal macho de la misma finca)' })
  @IsOptional()
  @IsUUID()
  fatherId?: string;

  @ApiPropertyOptional({ description: 'ID de la madre (animal hembra de la misma finca)' })
  @IsOptional()
  @IsUUID()
  motherId?: string;
}
