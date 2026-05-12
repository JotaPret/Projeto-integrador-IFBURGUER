import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CarrinhoService } from './carrinho.service';
import { SyncCarrinhoDto } from './dto/sync-carrinho.dto';

@Controller('carrinho')
@UseGuards(AuthGuard('jwt'))
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get()
  get(@Req() req: { user?: { userId: number } }) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.carrinhoService.getForUser(userId);
  }

  @Put()
  sync(
    @Req() req: { user?: { userId: number } },
    @Body() body: SyncCarrinhoDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.carrinhoService.syncForUser(userId, body);
  }

  @Delete()
  clear(@Req() req: { user?: { userId: number } }) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.carrinhoService.clearForUser(userId);
  }
}
