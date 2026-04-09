import { Type } from 'class-transformer';
import { IsArray, IsDecimal, IsInt, ValidateNested } from 'class-validator';

export class ItemPedidoDto {
  @IsInt()
  produtoId: number;

  @IsInt()
  quantidade: number;

  @IsDecimal()
  @Type(() => Number)
  preco: number;
}

export class CreatePedidoDto {
  @IsInt()
  usuarioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}
