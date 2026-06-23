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

    // 🧠 LÓGICA DE NEGOCIO: Evitar doble reserva (Concurrencia)
    // Buscamos si alguno de los asientos solicitados ya está en la base de datos para esta función
    const asientosOcupados = await this.asientoRepo.find({
      where: {
        funcion: { id: dto.funcionId },
        codigo: In(dto.asientos), // Busca coincidencias en el array ["A1", "A2"]
      },
    });

    if (asientosOcupados.length > 0) {
      const codigosOcupados = asientosOcupados.map((a) => a.codigo).join(', ');
      throw new ConflictException(
        `Los siguientes asientos ya están ocupados: ${codigosOcupados}`,
      );
    }

    // Calcula el total a pagar
    const totalPagado = funcion.precioEntrada * dto.asientos.length;

    // Prepara las entidades de Asiento (extrayendo fila y columna del código ej. "A-1")
    const nuevosAsientos = dto.asientos.map((codigoStr) => {
      // Opcional: Si tu frontend manda "A-1", puedes separar letra y número aquí.
      // Por simplicidad, guardaremos el código directo.
      return this.asientoRepo.create({
        codigo: codigoStr,
        fila: 0, // Aquí puedes implementar lógica para extraer la fila del código si lo deseas
        columna: 0,
        funcion: funcion,
      });
    });

    // Creamos la Reserva. Gracias a "cascade: true", los asientos se guardarán solos.
    const reserva = this.reservaRepo.create({
      totalPagado,
      usuario: { id: userId }, // Relacionamos con el ID del usuario logueado
      funcion: funcion,
      asientos: nuevosAsientos,
    });

    return this.reservaRepo.save(reserva);
  }

  async findMisReservas(userId: number): Promise<Reserva[]> {
    // Retorna las reservas del usuario con todo el detalle para mostrar el ticket
    return this.reservaRepo.find({
      where: { usuario: { id: userId } },
      relations: {
        funcion: {
          pelicula: true,
          sala: true,
        },
        asientos: true,
      }, // CORREGIDO AQUÍ PARA RELACIONES ANIDADAS
      order: { fechaReserva: 'DESC' },
    });
  }
}
