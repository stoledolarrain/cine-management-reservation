import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importación de todos los módulos que creaste
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { SalasModule } from './salas/salas.module';
import { FuncionesModule } from './funciones/funciones.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [
    // Variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Conexión a PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Crea las tablas automáticamente basado en tus Entities
    }),
    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    PeliculasModule,
    SalasModule,
    FuncionesModule,
    ReservasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
