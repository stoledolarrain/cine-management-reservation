import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dtos/create-reserva.dto';
import { AuthGuard } from '../auth/auth.guard';

// 🛡️ Toda reserva exige estar logueado (Regla de negocio)
@UseGuards(AuthGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  async crearReserva(
    @Body() createReservaDto: CreateReservaDto,
    @Request() req: unknown,
  ) {
    // 🧠 Le decimos a TypeScript la forma exacta que tiene req.user (id y rol)
    // Esto quita el error de ESLint por completo sin usar trucos de ignorar líneas
    const requestConUsuario = req as { user: { id: number; rol: string } };
    const userId = requestConUsuario.user.id;

    return this.reservasService.create(createReservaDto, userId);
  }

  @Get('mis-reservas')
  async obtenerMisReservas(@Request() req: unknown) {
    const requestConUsuario = req as { user: { id: number; rol: string } };
    const userId = requestConUsuario.user.id;

    return this.reservasService.findMisReservas(userId);
  }
}
