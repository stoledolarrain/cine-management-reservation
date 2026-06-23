import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static'; // NUEVO IMPORT
import { join } from 'path'; // NUEVO IMPORT

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { SalasModule } from './salas/salas.module';
import { FuncionesModule } from './funciones/funciones.module';
import { ReservasModule } from './reservas/reservas.module';
import { UploadsModule } from './uploads/uploads.module'; // NUEVO IMPORT

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // 👇 NUEVO: Habilitar que la carpeta uploads sea visible en internet
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Sube 2 niveles para salir de /dist y /src
      serveRoot: '/uploads', // La ruta en el navegador será /uploads/...
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PeliculasModule,
    SalasModule,
    FuncionesModule,
    ReservasModule,
    UploadsModule, // 👇 NUEVO: Registrar el módulo
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
