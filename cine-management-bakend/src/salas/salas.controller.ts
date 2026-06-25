import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dtos/create-sala.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  async createSala(@Body() createSalaDto: CreateSalaDto) {
    return this.salasService.create(createSalaDto);
  }

  @Get()
  async getSalas() {
    return this.salasService.findAll();
  }

  @Get(':id')
  async getSalaDetalle(@Param('id') id: string) {
    return this.salasService.findOne(+id);
  }
}
