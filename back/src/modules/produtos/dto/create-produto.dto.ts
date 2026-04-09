import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  titulo: string;

  @IsString()
  @MaxLength(30)
  categoria: string;

  @IsString()
  @MaxLength(255)
  descricao: string;

  @IsString()
  @MaxLength(255)
  foto: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  top?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 1 })
  @Type(() => Number)
  avaliacao?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  freteGratis?: number;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Type(() => Number)
  preco: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  desconto?: number;

  @IsOptional()
  @IsDateString()
  fimDesconto?: string;
}
