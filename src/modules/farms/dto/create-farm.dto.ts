import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFarmDto {
  @ApiProperty({ description: 'Nombre de la finca', example: 'Finca El Rosal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ description: 'Dirección o ubicación general', example: 'Vereda La Esperanza, Km 5' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ description: 'Departamento', example: 'Antioquia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ description: 'Municipio', example: 'Marinilla' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  municipality?: string;

  @ApiPropertyOptional({ description: 'Área en hectáreas', example: 120.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  areaHectares?: number;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '+57 300 123 4567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico de la finca', example: 'finca@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ description: 'RUT / NIT de la finca', example: '900123456-1' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rut?: string;
}
