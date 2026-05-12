import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';

@Module({
  controllers: [CarrinhoController],
  providers: [CarrinhoService, PrismaService],
  exports: [CarrinhoService],
})
export class CarrinhoModule {}
