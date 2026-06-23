import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

interface RequestConUsuario extends Request {
  user?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // CORREGIDO: Usamos el genérico <RequestConUsuario>
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Acceso denegado. Token faltante.');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || '';

      // CORREGIDO: Quitamos el "as". Declaramos el tipo en la variable para apaciguar al linter
      const payload: { sub: number } = await this.jwtService.verifyAsync(
        token,
        {
          secret: secret,
        },
      );

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('El usuario ya no existe.');

      // Guardamos al usuario en la petición para usarlo en los controladores
      request.user = user;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
