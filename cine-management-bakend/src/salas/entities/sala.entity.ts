import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string; // ej. "Sala 1 3D", "Sala VIP"

  @Column({ type: 'int' })
  filas: number;

  @Column({ type: 'int' })
  columnas: number;

  @Column({ type: 'int' })
  capacidadTotal: number;

  // Una sala alberga muchas funciones a lo largo del día
  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
}
