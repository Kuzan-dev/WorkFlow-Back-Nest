import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Mantenimiento } from '../mantenimientos/schemas/mantenimiento.schema';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Mantenimiento.name)
    private mantenimientoModel: Model<Mantenimiento>,
  ) {}

  @Cron('0 * * * *') // Se ejecutara el minuto 0 de cada hora de cada día
  async handleCron() {
    this.logger.debug('El cron job se ejecuto');

    // Buscar todos los mantenimientos ESTADO = programados
    const mantenimientos = await this.mantenimientoModel
      .find({ estado: 'programado' })
      .exec();
    // Iterar sobre los mantenimientos
    mantenimientos.forEach(async (mantenimiento) => {
      const fechaProgramada = moment(mantenimiento.fecha);
      const now = moment();
      // Si la fecha programada es menor a la fecha actual
      if (now.diff(fechaProgramada, 'hours') > 24) {
        mantenimiento.estado = 'expirado';
        await mantenimiento.save();
      }
    });
  }
}
