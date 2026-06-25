import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
