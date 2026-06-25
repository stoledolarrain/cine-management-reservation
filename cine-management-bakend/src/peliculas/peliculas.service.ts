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

  async findAll(buscar?: string, genero?: string): Promise<Pelicula[]> {
    const whereClause: any = {};
    if (buscar) whereClause.titulo = Like(`%${buscar}%`);
    if (genero) whereClause.genero = genero;
    return this.peliculaRepository.find({
      where: whereClause,
      relations: { funciones: true },
    });
  }

  async findOne(id: number): Promise<Pelicula> {
    const pelicula = await this.peliculaRepository.findOne({
      where: { id },
      relations: { funciones: true },
    });
    if (!pelicula) throw new NotFoundException('Película no encontrada.');
    return pelicula;
  }

  async create(
    dto: CreatePeliculaDto,
    file?: Express.Multer.File,
  ): Promise<Pelicula> {
    const posterUrl = file ? `/uploads/posters/${file.filename}` : null;

    const nuevaPelicula = new Pelicula();
    nuevaPelicula.titulo = dto.titulo;
    nuevaPelicula.sinopsis = dto.sinopsis;
    nuevaPelicula.genero = dto.genero;
    nuevaPelicula.duracion = dto.duracion;
    nuevaPelicula.clasificacion = dto.clasificacion;
    nuevaPelicula.posterUrl = posterUrl;

    return await this.peliculaRepository.save(nuevaPelicula);
  }

  async update(
    id: number,
    updateData: Partial<CreatePeliculaDto>,
    file?: Express.Multer.File,
  ): Promise<Pelicula> {
    const pelicula = await this.findOne(id);

    if (file) {
      updateData.posterUrl = `/uploads/posters/${file.filename}`;
    }

    Object.assign(pelicula, updateData);
    return await this.peliculaRepository.save(pelicula);
  }

  async remove(id: number): Promise<void> {
    const pelicula = await this.findOne(id);
    await this.peliculaRepository.remove(pelicula);
  }
}