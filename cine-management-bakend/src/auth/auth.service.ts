import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto'; // Creado en el paso anterior
import { LoginDto } from './dtos/login.dto'; // Creado en el paso anterior
import { hashPassword } from './crypto.utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nombre, rol } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = hashPassword(password);

    const newUser = await this.usersService.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'cliente',
    });

    return { message: 'Usuario registrado exitosamente', userId: newUser.id };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const payload = { sub: user.id, rol: user.rol };

    return {
      token: this.jwtService.sign(payload),
      rol: user.rol,
      nombre: user.nombre,
    };
  }
}
