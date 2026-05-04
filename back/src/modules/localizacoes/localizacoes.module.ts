import { Module } from '@nestjs/common';
import { LocalizacoesService } from './localizacoes.service';
import { LocalizacoesController } from './localizacoes.controller';
import { PrismaService } from '../../database/prisma.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [LocalizacoesController],
  providers: [LocalizacoesService, PrismaService, RolesGuard],
  exports: [LocalizacoesService],
})
export class LocalizacoesModule {}
