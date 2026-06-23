import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { CreatePeliculaDto } from './dtos/create-pelicula.dto';

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
  ) {}

  // Busca todas las películas, aplicando filtros si el frontend los envía
  async findAll(buscar?: string, genero?: string): Promise<Pelicula[]> {
    const whereClause: any = {};

    if (buscar) {
      whereClause.titulo = Like(`%${buscar}%`); // Búsqueda parcial (ej. "Bat" encuentra "Batman")
    }

    if (genero) {
      whereClause.genero = genero;
    }

    // Trae las películas y de paso carga las funciones asociadas
    return this.peliculaRepository.find({
      where: whereClause,
      relations: { funciones: true }, // CORREGIDO AQUÍ
    });
  }

  async findOne(id: number): Promise<Pelicula> {
    const pelicula = await this.peliculaRepository.findOne({
      where: { id },
      relations: { funciones: true }, // CORREGIDO AQUÍ
    });
    if (!pelicula) throw new NotFoundException('Película no encontrada.');
    return pelicula;
  }

  // --- Funciones de Administrador ---

  async create(createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
    const nuevaPelicula = this.peliculaRepository.create(createPeliculaDto);
    return this.peliculaRepository.save(nuevaPelicula);
  }

  async update(
    id: number,
    updateData: Partial<CreatePeliculaDto>,
  ): Promise<Pelicula> {
    const pelicula = await this.findOne(id);
    Object.assign(pelicula, updateData);
    return this.peliculaRepository.save(pelicula);
  }

  async remove(id: number): Promise<void> {
    const pelicula = await this.findOne(id);
    await this.peliculaRepository.remove(pelicula);
  }
}
