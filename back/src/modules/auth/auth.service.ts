import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone?: string) {
  if (!phone) return undefined;
  const trimmed = phone.trim();
  return trimmed ? trimmed : undefined;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async me(userId?: number) {
    if (!userId) {
      throw new UnauthorizedException('Nao autenticado.');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        pontos: true,
        createdAt: true,
        fotoPerfil: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return { user };
  }

  async register(data: RegisterDto) {
    const email = normalizeEmail(data.email);

    const existing = await this.prisma.usuario.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('E-mail ja cadastrado.');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nome: data.nome.trim().replace(/\s+/g, ' '),
        email,
        telefone: normalizePhone(data.telefone),
        senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        pontos: true,
        createdAt: true,
        fotoPerfil: true,
      },
    });

    const accessToken = await this.signToken(user.id, user.email);

    return { user, accessToken };
  }

  async login(data: LoginDto) {
    const email = normalizeEmail(data.email);

    const user = await this.prisma.usuario.findFirst({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        pontos: true,
        createdAt: true,
        senhaHash: true,
        fotoPerfil: true,
      },
    });

    if (!user?.senhaHash) {
      throw new UnauthorizedException('E-mail ou senha invalidos.');
    }

    const ok = await bcrypt.compare(data.senha, user.senhaHash);
    if (!ok) {
      throw new UnauthorizedException('E-mail ou senha invalidos.');
    }

    const accessToken = await this.signToken(user.id, user.email);

    const { senhaHash: _senhaHash, ...safeUser } = user;

    return { user: safeUser, accessToken };
  }

  async redeemPoints(userId?: number, pontos?: number) {
    if (!userId) {
      throw new UnauthorizedException('Nao autenticado.');
    }

    const cost = Number(pontos);
    if (!Number.isInteger(cost) || cost <= 0) {
      throw new BadRequestException('Pontos invalidos.');
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const result = await tx.usuario.updateMany({
        where: {
          id: userId,
          pontos: {
            gte: cost,
          },
        },
        data: {
          pontos: {
            decrement: cost,
          },
        },
      });

      if (result.count === 0) {
        throw new ConflictException('Pontos insuficientes.');
      }

      const user = await tx.usuario.findUnique({
        where: { id: userId },
        select: {
          id: true,
          pontos: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuario nao encontrado.');
      }

      return user;
    });

    return { user: updatedUser };
  }

  private async signToken(userId: number, email: string | null) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }
}
