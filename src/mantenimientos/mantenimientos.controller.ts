import { Controller, Get, Param } from '@nestjs/common';
import { MantenimientosService } from './mantenimientos.service';

@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private mantenimientosService: MantenimientosService) {}

  @Get(':placa')
  async getMantenimientosByPlaca(@Param('placa') placa: string) {
    const mantFound =
      await this.mantenimientosService.getMantenimientosPorPlaca(placa);
    if (!mantFound)
      throw new Error('No se encontraron mantenimientos para la placa');
    return mantFound;
  }
}
