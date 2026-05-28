import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  // ── Finca ──────────────────────────────────────────────
  @IsString()
  farmName: string;

  @IsOptional()
  @IsString()
  farmLocation?: string;

  @IsOptional()
  @IsString()
  farmDepartment?: string;

  @IsOptional()
  @IsString()
  farmPhone?: string;

  @IsOptional()
  @IsEmail()
  farmEmail?: string;

  @IsOptional()
  @IsString()
  farmNotes?: string;

  // ── Usuario admin de la finca ──────────────────────────
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // ── Suscripción (undefined = sin límite) ───────────────
  @IsOptional()
  @IsInt()
  @Min(1)
  subscriptionMonths?: number;
}
