import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProdutoDto) {
    return this.prisma.produto.create({
      data,
    });
  }

  findAll() {
    return this.prisma.produto.findMany();
  }

  findByCategory(categoria: string) {
    return this.prisma.produto.findMany({
      where: { categoria },
    });
  }

  findOne(id: number) {
    return this.prisma.produto.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateProdutoDto) {
    return this.prisma.produto.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.produto.delete({
      where: { id },
    });
  }

  getTop() {
    return this.prisma.produto.findMany({
      where: { top: 1 },
    });
  }

  getPromocoes() {
    return this.prisma.produto.findMany({
      where: {
        desconto: { gt: 0 },
        fimDesconto: { gt: new Date() },
      },
    });
  }
}
