import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  private readonly safeUsuarioSelect = {
    id: true,
    nome: true,
    email: true,
    telefone: true,
    createdAt: true,
    pedidos: true,
  } as const;

  create(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data,
      select: this.safeUsuarioSelect,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: this.safeUsuarioSelect,
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: this.safeUsuarioSelect,
    });
  }

  update(id: number, data: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: this.safeUsuarioSelect,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
