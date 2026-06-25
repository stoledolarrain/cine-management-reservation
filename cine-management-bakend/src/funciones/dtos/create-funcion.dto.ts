import { IsInt, IsDateString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateFuncionDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID de la película es obligatorio' })
  peliculaId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID de la sala es obligatorio' })
  salaId: number;

  @IsDateString({}, { message: 'Debe ser una fecha y hora válida (ISO 8601)' })
  @IsNotEmpty({ message: 'La fecha y hora son obligatorias' })
  fechaHora: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  precioEntrada: number;
}
