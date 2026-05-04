import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalizacoesService } from './localizacoes.service';
import { CreateLocalizacaoDto } from './dto/create-localizacao.dto';
import { UpdateLocalizacaoDto } from './dto/update-localizacao.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../../generated/prisma/client';

@Controller('localizacoes')
export class LocalizacoesController {
  constructor(private readonly localizacoesService: LocalizacoesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createLocalizacaoDto: CreateLocalizacaoDto) {
    return this.localizacoesService.create(createLocalizacaoDto);
  }

  @Get()
  findAll() {
    return this.localizacoesService.findAll();
  }

  @Get('destacadas')
  findDestacadas() {
    return this.localizacoesService.findDestacadas();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.localizacoesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocalizacaoDto: UpdateLocalizacaoDto,
  ) {
    return this.localizacoesService.update(id, updateLocalizacaoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.localizacoesService.remove(id);
  }
}
