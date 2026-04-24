import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, ValidateNested } from 'class-validator';

export class ItemPedidoDto {
  @IsInt()
  produtoId: number;

  @IsInt()
  quantidade: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
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
