import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. FUNDAMENTAL PARA REACT: Habilitar CORS
  // Esto permite que una app en http://localhost:5173 (Vite/React)
  // le pida datos a esta API en http://localhost:3000
  app.enableCors();

  // 2. FUNDAMENTAL PARA LA SEGURIDAD: Activar DTOs
  // Rechaza automáticamente cualquier JSON mal formado o con datos extra
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend del Cine escuchando en http://localhost:${port}`);
}
bootstrap();
