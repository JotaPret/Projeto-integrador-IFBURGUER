import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ConfirmPedidoDto } from './dto/confirm-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  private readonly safeUsuarioSelect = {
    id: true,
    nome: true,
    email: true,
    telefone: true,
    fotoPerfil: true,
    createdAt: true,
  } as const;

  async confirmForUser(usuarioId: number, body: ConfirmPedidoDto) {
    return this.prisma.pedido.create({
      data: {
        usuarioId,
        itensPedido: {
          create: body.itens,
        },
      },
      include: {
        usuario: {
          select: this.safeUsuarioSelect,
        },
        itensPedido: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async create(data: CreatePedidoDto) {
    return this.prisma.pedido.create({
      data: {
        usuarioId: data.usuarioId,
        itensPedido: {
          create: data.itens,
        },
      },
      include: {
        usuario: {
          select: this.safeUsuarioSelect,
        },
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
        usuario: {
          select: this.safeUsuarioSelect,
        },
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
        usuario: {
          select: this.safeUsuarioSelect,
        },
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
      orderBy: { data: 'desc' },
      include: {
        usuario: {
          select: this.safeUsuarioSelect,
        },
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
