import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'text' })
  sinopsis: string;

  @Column({ type: 'varchar', length: 50 })
  genero: string;

  @Column({ type: 'int' })
  duracion: number; 

  @Column({ type: 'varchar', length: 20 })
  clasificacion: string;

  @Column({ type: 'varchar', nullable: true })
  posterUrl: string | null;

  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones: Funcion[];
}
