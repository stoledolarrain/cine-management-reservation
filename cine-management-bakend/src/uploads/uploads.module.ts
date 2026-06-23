import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UsersModule } from '../users/users.module'; // Importamos a los usuarios
import { JwtModule } from '@nestjs/jwt'; // Importamos las herramientas del Token

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
