import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcion } from './entities/funcion.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Sala } from '../salas/entities/sala.entity';
import { CreateFuncionDto } from './dtos/create-funcion.dto';

@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion) private funcionRepo: Repository<Funcion>,
    @InjectRepository(Pelicula) private peliculaRepo: Repository<Pelicula>,
    @InjectRepository(Sala) private salaRepo: Repository<Sala>,
  ) {}

  async create(dto: CreateFuncionDto): Promise<Funcion> {
    const pelicula = await this.peliculaRepo.findOne({
      where: { id: dto.peliculaId },
    });
    if (!pelicula) throw new NotFoundException('Película no encontrada.');

    const sala = await this.salaRepo.findOne({ where: { id: dto.salaId } });
    if (!sala) throw new NotFoundException('Sala no encontrada.');

    const nuevoInicio = new Date(dto.fechaHora);
    const nuevoFin = new Date(
      nuevoInicio.getTime() + pelicula.duracion * 60000,
    );

    const funcionesEnSala = await this.funcionRepo.find({
      where: { sala: { id: dto.salaId } },
      relations: { pelicula: true }, 
    });

    for (const funcionExistente of funcionesEnSala) {
      const inicioExistente = new Date(funcionExistente.fechaHora);
      const finExistente = new Date(
        inicioExistente.getTime() + funcionExistente.pelicula.duracion * 60000,
      );

      if (nuevoInicio < finExistente && inicioExistente < nuevoFin) {
        throw new ConflictException(
          `Choque de horarios. La sala está ocupada por la película '${funcionExistente.pelicula.titulo}' en ese rango de tiempo.`,
        );
      }
    }

    const nuevaFuncion = this.funcionRepo.create({
      fechaHora: dto.fechaHora,
      precioEntrada: dto.precioEntrada,
      pelicula: pelicula,
      sala: sala,
    });

    return this.funcionRepo.save(nuevaFuncion);
  }

  async findAll(): Promise<Funcion[]> {
    return this.funcionRepo.find({
      relations: { pelicula: true, sala: true, asientosOcupados: true }, 
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Funcion> {
    const funcion = await this.funcionRepo.findOne({
      where: { id },
      relations: { pelicula: true, sala: true, asientosOcupados: true },
    });
    if (!funcion) throw new NotFoundException('Función no encontrada.');
    return funcion;
  }
}
