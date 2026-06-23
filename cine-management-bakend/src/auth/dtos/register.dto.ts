import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsIn(['cliente', 'admin'], { message: 'El rol debe ser cliente o admin' })
  rol?: string;
}
