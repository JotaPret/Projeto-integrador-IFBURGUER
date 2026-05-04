import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaService } from '../../database/prisma.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService, RolesGuard],
  exports: [UsuariosService],
})
export class UsuariosModule {}
