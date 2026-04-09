import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateLocalizacaoDto } from './dto/create-localizacao.dto';
import { UpdateLocalizacaoDto } from './dto/update-localizacao.dto';

@Injectable()
export class LocalizacoesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateLocalizacaoDto) {
    return this.prisma.localizacao.create({
      data,
    });
  }

  findAll() {
    return this.prisma.localizacao.findMany();
  }

  findDestacadas() {
    return this.prisma.localizacao.findMany({
      where: { destaque: 1 },
    });
  }

  findOne(id: number) {
    return this.prisma.localizacao.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateLocalizacaoDto) {
    return this.prisma.localizacao.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.localizacao.delete({
      where: { id },
    });
  }
}
