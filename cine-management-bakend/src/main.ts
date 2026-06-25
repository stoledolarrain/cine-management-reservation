import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 1. AÑADE ESTAS DOS IMPORTACIONES
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // FUNDAMENTAL PARA REACT: Habilitar CORS
  app.enableCors();

  // FUNDAMENTAL PARA LA SEGURIDAD: Activar DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 2. AÑADE ESTA LÍNEA MÁGICA: Habilitar el acceso público a los archivos
  // Esto intercepta las peticiones a '/uploads' y busca el archivo en la carpeta física
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend del Cine escuchando en http://localhost:${port}`);
}
bootstrap();
