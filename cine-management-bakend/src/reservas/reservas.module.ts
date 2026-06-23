import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Asiento } from './entities/asiento.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Asiento, Funcion]),
    UsersModule,
    JwtModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
