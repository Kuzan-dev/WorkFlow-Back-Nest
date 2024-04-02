import { Injectable } from '@nestjs/common';
import {
  Notificacion,
  NotificacionDocument,
} from './schemas/notificacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pubSub } from 'src/shared/pubsub';
import { NotificationBySegmentBuilder } from 'onesignal-api-client-core';
import { OneSignalService } from 'onesignal-api-client-nest';

@Injectable()
export class NotificacionesService {
  // private client: OneSignal.DefaultApi;
  constructor(
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<NotificacionDocument>,
    private readonly oneSignalService: OneSignalService,
  ) {}

  async crearNotificacion(
    canal: string,
    tipo: string,
    identificador: string,
    titulo: string,
    descripcion: string,
    fecha: Date,
    leido: boolean,
  ) {
    const notificacion = new this.notificacionModel({
      titulo,
      tipo,
      descripcion,
      identificador,
      fecha,
      leido,
    });
    await notificacion.save();

    pubSub.publish(canal, notificacion);
    const notification = new NotificationBySegmentBuilder()
      .setIncludedSegments([canal])
      .notification()
      .setContents({ en: descripcion })
      .setHeadings({ en: titulo })
      .build();

    await this.oneSignalService.createNotification(notification);
  }

  async obtenerNotificacionesNoLeidas(): Promise<Notificacion[]> {
    return await this.notificacionModel.find({ leido: false });
  }
}
