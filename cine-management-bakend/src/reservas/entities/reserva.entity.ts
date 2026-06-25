import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';
import { Asiento } from './asiento.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPagado: number;

  @CreateDateColumn()
  fechaReserva: Date;

  @ManyToOne(() => User, (user) => user.reservas)
  usuario: User;

  @ManyToOne(() => Funcion, (funcion) => funcion.reservas)
  funcion: Funcion;

  @OneToMany(() => Asiento, (asiento) => asiento.reserva, { cascade: true })
  asientos: Asiento[];
}
