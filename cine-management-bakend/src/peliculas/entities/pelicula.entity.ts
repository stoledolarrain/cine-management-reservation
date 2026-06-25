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
  duracion: number; // Duración en minutos

  @Column({ type: 'varchar', length: 20 })
  clasificacion: string; // ej. +14, R, Todo público

  @Column({ type: 'varchar', nullable: true })
  posterUrl: string | null;

  // Una película se proyecta en muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones: Funcion[];
}
