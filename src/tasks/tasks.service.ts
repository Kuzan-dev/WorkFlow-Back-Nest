import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Mantenimiento } from '../mantenimientos/schemas/mantenimiento.schema';
import { Notificacion } from 'src/notificaciones/schemas/notificacion.schema';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Mantenimiento.name)
    private mantenimientoModel: Model<Mantenimiento>,
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<Notificacion>,
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
  @Cron('0 * * * *') // Se ejecutara el minuto 0 de cada hora de cada día
  async handleNotificacionCron() {
    this.logger.debug('El cron job de notificaciones se ejecuto');

    // Buscar todas las notificaciones no leidas
    const notificaciones = await this.notificacionModel
      .find({ leido: false })
      .exec();
    // Iterar sobre las notificaciones
    notificaciones.forEach(async (notificacion) => {
      const fechaNotificacion = moment(notificacion.fecha);
      const now = moment();
      // Si han pasado más de 48 horas desde la fecha de la notificación
      if (now.diff(fechaNotificacion, 'hours') > 48) {
        notificacion.leido = true;
        await notificacion.save();
      }
    });
  }
}
