import { IsInt, IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  funcionId: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos un asiento' })
  @IsString({
    each: true,
    message: 'Cada asiento debe ser un texto, ej: "A-1"',
  })
  asientos: string[];
}
