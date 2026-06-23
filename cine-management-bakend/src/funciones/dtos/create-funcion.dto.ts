import { IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateFuncionDto {
  @IsInt()
  peliculaId: number;

  @IsInt()
  salaId: number;

  @IsDateString({}, { message: 'Debe ser una fecha y hora válida (ISO 8601)' })
  fechaHora: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precioEntrada: number;
}