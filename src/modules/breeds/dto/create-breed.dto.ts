import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBreedDto {
  @ApiProperty({ example: 'Holstein', description: 'Nombre de la raza' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Raza lechera de origen europeo', description: 'Descripción de la raza' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'Doble propósito', description: 'Propósito productivo principal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  purpose?: string;

  @ApiPropertyOptional({ example: 'Europa', description: 'Origen geográfico de la raza' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin?: string;
}
