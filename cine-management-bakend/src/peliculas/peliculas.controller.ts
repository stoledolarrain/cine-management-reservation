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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dtos/create-pelicula.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get()
  async getCartelera(@Query('buscar') buscar?: string, @Query('genero') genero?: string) {
    return this.peliculasService.findAll(buscar, genero);
  }

  @Get(':id')
  async getDetalle(@Param('id') id: string) {
    return this.peliculasService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file')) // 'file' coincide con el append en el frontend
  async createPelicula(
    @Body() createPeliculaDto: CreatePeliculaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Convertimos duración porque FormData envía todo como string
    createPeliculaDto.duracion = parseInt(createPeliculaDto.duracion as any, 10);
    return this.peliculasService.create(createPeliculaDto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePelicula(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePeliculaDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (updateData.duracion) updateData.duracion = parseInt(updateData.duracion as any, 10);
    return this.peliculasService.update(+id, updateData, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deletePelicula(@Param('id') id: string) {
    await this.peliculasService.remove(+id);
    return { message: 'Película eliminada correctamente.' };
  }
}