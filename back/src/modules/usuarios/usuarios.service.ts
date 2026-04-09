import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      include: {
        pedidos: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: {
        pedidos: true,
      },
    });
  }

  update(id: number, data: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
