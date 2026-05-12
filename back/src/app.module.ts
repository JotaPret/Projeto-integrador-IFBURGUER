import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { LocalizacoesModule } from './modules/localizacoes/localizacoes.module';
import { CarrinhoModule } from './modules/carrinho/carrinho.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsuariosModule,
    ProdutosModule,
    PedidosModule,
    LocalizacoesModule,
    CarrinhoModule,
  ],
})
export class AppModule {}
