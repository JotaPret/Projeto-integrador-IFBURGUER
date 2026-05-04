import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { PrismaService } from '../../database/prisma.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService, PrismaService, RolesGuard],
  exports: [ProdutosService],
})
export class ProdutosModule {}
