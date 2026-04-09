import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePedidoDto) {
    return this.prisma.pedido.create({
      data: {
        usuarioId: data.usuarioId,
        itensPedido: {
          create: data.itens,
        },
      },
      include: {
        usuario: true,
        itensPedido: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.pedido.findMany({
      include: {
        usuario: true,
        itensPedido: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pedido.findUnique({
      where: { id },
      include: {
        usuario: true,
        itensPedido: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  findByUsuario(usuarioId: number) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        usuario: true,
        itensPedido: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.pedido.delete({
      where: { id },
    });
  }
}
