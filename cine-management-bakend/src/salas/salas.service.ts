import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from './entities/sala.entity';
import { CreateSalaDto } from './dtos/create-sala.dto';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  async create(createSalaDto: CreateSalaDto): Promise<Sala> {
    // 🧠 LÓGICA DE NEGOCIO: Capacidad Total = Filas * Columnas
    const capacidadTotal = createSalaDto.filas * createSalaDto.columnas;

    const nuevaSala = this.salaRepository.create({
      ...createSalaDto,
      capacidadTotal, // Inyectamos el cálculo en la base de datos
    });

    return this.salaRepository.save(nuevaSala);
  }

  async findAll(): Promise<Sala[]> {
    return this.salaRepository.find();
  }

  async findOne(id: number): Promise<Sala> {
    const sala = await this.salaRepository.findOne({ where: { id } });
    if (!sala) throw new NotFoundException('Sala no encontrada.');
    return sala;
  }
}
