import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FuncionesService } from './funciones.service';
import { CreateFuncionDto } from './dtos/create-funcion.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  // 🌍 Público: Ver funciones disponibles (Para la cartelera)
  @Get()
  async getFunciones() {
    return this.funcionesService.findAll();
  }

  // 🌍 Público: Ver detalle de función con asientos ocupados
  @Get(':id')
  async getFuncionDetalle(@Param('id') id: string) {
    return this.funcionesService.findOne(+id);
  }

  // 🛡️ Admin: Crear nueva función
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async createFuncion(@Body() createFuncionDto: CreateFuncionDto) {
    return this.funcionesService.create(createFuncionDto);
  }
}
