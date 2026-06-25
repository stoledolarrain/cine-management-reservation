import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePeliculaDto {
  @IsString()
  titulo: string;

  @IsString()
  sinopsis: string;

  @IsString()
  genero: string;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'La duración debe ser mayor a 0 minutos' })
  duracion: number;

  @IsString()
  clasificacion: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}
