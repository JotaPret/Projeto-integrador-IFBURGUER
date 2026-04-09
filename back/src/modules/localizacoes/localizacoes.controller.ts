import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LocalizacoesService } from './localizacoes.service';
import { CreateLocalizacaoDto } from './dto/create-localizacao.dto';
import { UpdateLocalizacaoDto } from './dto/update-localizacao.dto';

@Controller('localizacoes')
export class LocalizacoesController {
  constructor(private readonly localizacoesService: LocalizacoesService) {}

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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocalizacaoDto: UpdateLocalizacaoDto,
  ) {
    return this.localizacoesService.update(id, updateLocalizacaoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.localizacoesService.remove(id);
  }
}
