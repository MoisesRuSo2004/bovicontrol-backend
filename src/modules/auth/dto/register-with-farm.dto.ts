import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterWithFarmDto {
  // ── Datos del usuario ────────────────────────────────────────────────────────

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'juan@finca.com' })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener mayúsculas, minúsculas y números',
  })
  password: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  // ── Datos de la finca ────────────────────────────────────────────────────────

  @ApiProperty({ example: 'Finca El Progreso' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la finca es requerido' })
  @MaxLength(150)
  farmName: string;

  @ApiPropertyOptional({ example: 'Vereda La Esperanza, km 12 vía Bogotá' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  farmLocation?: string;

  @ApiPropertyOptional({ example: 'Cundinamarca' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  farmDepartment?: string;

  @ApiPropertyOptional({ example: 'Villavicencio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  farmMunicipality?: string;

  @ApiPropertyOptional({ example: 150.5, description: 'Área de la finca en hectáreas' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  farmAreaHectares?: number;

  @ApiPropertyOptional({ example: '+57 300 987 6543' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  farmPhone?: string;

  @ApiPropertyOptional({ example: 'finca@ejemplo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El email de la finca no es válido' })
  @MaxLength(150)
  farmEmail?: string;

  @ApiPropertyOptional({ example: '900.123.456-7', description: 'NIT / RUT de la finca (único)' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  farmRut?: string;
}
