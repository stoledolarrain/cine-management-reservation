import { IsString, IsInt, Min } from 'class-validator';

export class CreateSalaDto {
  @IsString()
  nombre: string;

  @IsInt()
  @Min(1)
  filas: number;

  @IsInt()
  @Min(1)
  columnas: number;

  // La capacidadTotal no se pide en el DTO porque la calcularemos en el backend (filas * columnas)
}
