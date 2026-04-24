import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ConfirmPedidoDto } from './dto/confirm-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('confirmar')
  confirmar(
    @Req() req: { user?: { userId: number } },
    @Body() body: ConfirmPedidoDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.pedidosService.confirmForUser(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('historico')
  historico(@Req() req: { user?: { userId: number } }) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.pedidosService.findByUsuario(userId);
  }

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.pedidosService.findByUsuario(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.remove(id);
  }
}
