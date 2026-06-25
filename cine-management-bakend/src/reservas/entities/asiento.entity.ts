import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Reserva } from './reserva.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Unique(['codigo', 'funcion'])
@Entity('asientos_reservados')
export class Asiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  codigo: string;

  @Column({ type: 'int' })
  fila: number;

  @Column({ type: 'int' })
  columna: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.asientos, {
    onDelete: 'CASCADE',
  })
  reserva: Reserva;

  @ManyToOne(() => Funcion, (funcion) => funcion.asientosOcupados, {
    onDelete: 'CASCADE',
  })
  funcion: Funcion;
}
