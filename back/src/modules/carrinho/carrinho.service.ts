import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SyncCarrinhoDto } from './dto/sync-carrinho.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CarrinhoService {
  constructor(private prisma: PrismaService) {}

  async getForUser(usuarioId: number) {
    const itens = await this.prisma.carrinhoItem.findMany({
      where: { usuarioId },
      orderBy: { updatedAt: 'desc' },
      include: {
        produto: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            foto: true,
            avaliacao: true,
          },
        },
      },
    });

    return {
      itens: itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco: Number(item.preco),
        produto: item.produto,
        updatedAt: item.updatedAt,
      })),
    };
  }

  async syncForUser(usuarioId: number, body: SyncCarrinhoDto) {
    const map = new Map<number, { produtoId: number; quantidade: number; preco: number }>();

    for (const raw of body.itens ?? []) {
      const produtoId = Number(raw.produtoId);
      const quantidade = Number(raw.quantidade);
      const preco = Number(raw.preco);

      if (!Number.isInteger(produtoId) || produtoId <= 0) continue;
      if (!Number.isInteger(quantidade) || quantidade <= 0) continue;
      if (!Number.isFinite(preco) || preco < 0) continue;

      const existing = map.get(produtoId);
      if (!existing) {
        map.set(produtoId, { produtoId, quantidade, preco });
      } else {
        map.set(produtoId, {
          produtoId,
          quantidade: existing.quantidade + quantidade,
          preco,
        });
      }
    }

    const data = Array.from(map.values()).map(item => ({
      usuarioId,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      preco: new Prisma.Decimal(String(item.preco)),
    }));

    await this.prisma.$transaction(async tx => {
      await tx.carrinhoItem.deleteMany({
        where: { usuarioId },
      });

      if (data.length > 0) {
        await tx.carrinhoItem.createMany({
          data,
        });
      }
    });

    return this.getForUser(usuarioId);
  }

  async clearForUser(usuarioId: number) {
    await this.prisma.carrinhoItem.deleteMany({
      where: { usuarioId },
    });

    return { ok: true };
  }
}
