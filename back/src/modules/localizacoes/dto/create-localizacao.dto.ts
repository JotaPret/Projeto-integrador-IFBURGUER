import { IsString, MinLength, MaxLength, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocalizacaoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  titulo: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  destaque?: number;
}
