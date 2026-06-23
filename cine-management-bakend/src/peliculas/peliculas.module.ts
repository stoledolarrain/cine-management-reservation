import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { UsersModule } from '../users/users.module'; // Para que funcione el AuthGuard
import { JwtModule } from '@nestjs/jwt'; // Para que funcione el AuthGuard

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula]), UsersModule, JwtModule],
  controllers: [PeliculasController],
  providers: [PeliculasService],
  exports: [PeliculasService],
})
export class PeliculasModule {}
