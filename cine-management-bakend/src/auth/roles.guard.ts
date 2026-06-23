import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

interface RequestConUsuario extends Request {
  user?: { rol: string };
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // CORREGIDO: Usamos el genérico <RequestConUsuario> en la función, sin la palabra "as"
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado.');
    }

    if (user.rol !== 'admin') {
      throw new ForbiddenException(
        'Acceso denegado. Exclusivo para administradores.',
      );
    }

    return true;
  }
}
