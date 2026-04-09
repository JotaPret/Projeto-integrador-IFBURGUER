import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, PrismaService],
  exports: [PedidosService],
})
export class PedidosModule {}
