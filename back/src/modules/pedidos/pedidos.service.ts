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
    pontos: true,
    fotoPerfil: true,
    createdAt: true,
  } as const;

  private calculateLoyaltyPoints(body: ConfirmPedidoDto) {
    const totalCents = (body.itens || []).reduce((sum, item) => {
      const unitCents = Math.round(Number(item.preco) * 100);
      const qty = Number(item.quantidade);

      if (!Number.isFinite(unitCents) || !Number.isFinite(qty) || qty <= 0) {
        return sum;
      }

      return sum + unitCents * qty;
    }, 0);

    return Math.max(0, Math.floor(totalCents / 100));
  }

  async confirmForUser(usuarioId: number, body: ConfirmPedidoDto) {
    const pontosGanhos = this.calculateLoyaltyPoints(body);

    return this.prisma.$transaction(async tx => {
      const pedido = await tx.pedido.create({
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

      if (pontosGanhos > 0) {
        await tx.usuario.update({
          where: { id: usuarioId },
          data: {
            pontos: { increment: pontosGanhos },
          },
        });
      }

      const usuarioAtualizado = await tx.usuario.findUnique({
        where: { id: usuarioId },
        select: this.safeUsuarioSelect,
      });

      return {
        ...pedido,
        usuario: usuarioAtualizado ?? pedido.usuario,
      };
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
