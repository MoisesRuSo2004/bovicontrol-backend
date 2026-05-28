import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  months?: number | null;

  @IsOptional()
  @IsString()
  notes?: string;
}
