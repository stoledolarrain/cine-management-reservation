import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcion } from './entities/funcion.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Sala } from '../salas/entities/sala.entity';
import { FuncionesService } from './funciones.service';
import { FuncionesController } from './funciones.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // Importamos también Pelicula y Sala porque el servicio necesita consultar sus datos
  imports: [
    TypeOrmModule.forFeature([Funcion, Pelicula, Sala]),
    UsersModule,
    JwtModule,
  ],
  controllers: [FuncionesController],
  providers: [FuncionesService],
  exports: [FuncionesService],
})
export class FuncionesModule {}
