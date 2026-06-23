import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Este user lo inyectó el AuthGuard un paso antes

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
