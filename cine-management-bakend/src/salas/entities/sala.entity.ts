import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string; 

  @Column({ type: 'int' })
  filas: number;

  @Column({ type: 'int' })
  columnas: number;

  @Column({ type: 'int' })
  capacidadTotal: number;

  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
}
