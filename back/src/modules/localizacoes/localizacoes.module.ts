import { Module } from '@nestjs/common';
import { LocalizacoesService } from './localizacoes.service';
import { LocalizacoesController } from './localizacoes.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [LocalizacoesController],
  providers: [LocalizacoesService, PrismaService],
  exports: [LocalizacoesService],
})
export class LocalizacoesModule {}
