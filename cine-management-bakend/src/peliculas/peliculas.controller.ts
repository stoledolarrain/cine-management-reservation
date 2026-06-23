import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dtos/create-pelicula.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  // 🌍 PÚBLICO: Ver cartelera (Req: Buscar por nombre y filtrar por género)
  // GET http://localhost:3000/peliculas?buscar=Avengers&genero=Accion
  @Get()
  async getCartelera(
    @Query('buscar') buscar?: string,
    @Query('genero') genero?: string,
  ) {
    return this.peliculasService.findAll(buscar, genero);
  }

  // 🌍 PÚBLICO: Detalle de película
  @Get(':id')
  async getDetalle(@Param('id') id: string) {
    return this.peliculasService.findOne(+id);
  }

  // 🛡️ ADMINISTRADOR: Crear película
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async createPelicula(@Body() createPeliculaDto: CreatePeliculaDto) {
    return this.peliculasService.create(createPeliculaDto);
  }

  // 🛡️ ADMINISTRADOR: Editar película
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  async updatePelicula(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePeliculaDto>,
  ) {
    return this.peliculasService.update(+id, updateData);
  }

  // 🛡️ ADMINISTRADOR: Eliminar película
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deletePelicula(@Param('id') id: string) {
    await this.peliculasService.remove(+id);
    return { message: 'Película eliminada correctamente.' };
  }
}
