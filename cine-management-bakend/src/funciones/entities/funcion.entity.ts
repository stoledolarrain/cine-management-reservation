import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Sala } from '../../salas/entities/sala.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Asiento } from '../../reservas/entities/asiento.entity';

@Entity('funciones')
export class Funcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioEntrada: number;

  // Relaciones
  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, { eager: true })
  pelicula: Pelicula;

  @ManyToOne(() => Sala, (sala) => sala.funciones, { eager: true })
  sala: Sala;

  @OneToMany(() => Reserva, (reserva) => reserva.funcion)
  reservas: Reserva[];

  // Asientos ocupados en ESTA función específica
  @OneToMany(() => Asiento, (asiento) => asiento.funcion)
  asientosOcupados: Asiento[];
}
