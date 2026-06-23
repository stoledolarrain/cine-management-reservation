import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  // Conectamos la entidad User para que TypeORM la reconozca
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService], // Exportamos el servicio para que AuthModule pueda usarlo
})
export class UsersModule {}
