import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PrismaService } from '../../database/prisma.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, PrismaService, RolesGuard],
  exports: [PedidosService],
})
export class PedidosModule {}
