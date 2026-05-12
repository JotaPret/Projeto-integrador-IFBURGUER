import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CarrinhoItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  produtoId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade: number;

  @Type(() => Number)
  @Min(0)
  preco: number;
}
