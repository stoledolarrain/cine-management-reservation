import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { Asiento } from './entities/asiento.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { CreateReservaDto } from './dtos/create-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva) private reservaRepo: Repository<Reserva>,
    @InjectRepository(Asiento) private asientoRepo: Repository<Asiento>,
    @InjectRepository(Funcion) private funcionRepo: Repository<Funcion>,
  ) {}

  async create(dto: CreateReservaDto, userId: number): Promise<Reserva> {
    const funcion = await this.funcionRepo.findOne({
      where: { id: dto.funcionId },
    });
    if (!funcion) throw new NotFoundException('La función no existe.');

 
    const asientosOcupados = await this.asientoRepo.find({
      where: {
        funcion: { id: dto.funcionId },
        codigo: In(dto.asientos),
      },
    });

    if (asientosOcupados.length > 0) {
      const codigosOcupados = asientosOcupados.map((a) => a.codigo).join(', ');
      throw new ConflictException(
        `Los siguientes asientos ya están ocupados: ${codigosOcupados}`,
      );
    }

    const totalPagado = funcion.precioEntrada * dto.asientos.length;

    const nuevosAsientos = dto.asientos.map((codigoStr) => {
      const [letra, numero] = codigoStr.split('-');

      const fila = letra.toUpperCase().charCodeAt(0) - 64;
      const columna = parseInt(numero, 10);

      return this.asientoRepo.create({
        codigo: codigoStr,
        fila: fila, 
        columna: columna,
        funcion: funcion,
      });
    });

    const reserva = this.reservaRepo.create({
      totalPagado,
      usuario: { id: userId }, 
      funcion: funcion,
      asientos: nuevosAsientos,
    });

    return this.reservaRepo.save(reserva);
  }

  async findMisReservas(userId: number): Promise<Reserva[]> {
    return this.reservaRepo.find({
      where: { usuario: { id: userId } },
      relations: {
        funcion: {
          pelicula: true,
          sala: true,
        },
        asientos: true,
      }, 
      order: { fechaReserva: 'DESC' },
    });
  }
}
