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
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: number = req.user.id;
    return this.reservasService.create(createReservaDto, userId);
  }

  @Get('mis-reservas')
  async obtenerMisReservas(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: number = req.user.id;
    return this.reservasService.findMisReservas(userId);
  }
}
