import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { CarrinhoItemDto } from './carrinho-item.dto';

export class SyncCarrinhoDto {
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => CarrinhoItemDto)
  itens: CarrinhoItemDto[];
}
