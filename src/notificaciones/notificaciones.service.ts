import { Injectable } from '@nestjs/common';
import {
  Notificacion,
  NotificacionDocument,
} from './schemas/notificacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pubSub } from 'src/shared/pubsub';
import * as OneSignal from '@onesignal/node-onesignal';

@Injectable()
export class NotificacionesService {
  private client: OneSignal.DefaultApi;
  constructor(
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<NotificacionDocument>,
  ) {
    const configuration = OneSignal.createConfiguration({
      userKey: 'ZDBhYjUwMDYtMDU2ZC00NGE0LWEzOGQtNzE0MDYwMmI0ZWY2',
      appKey: '53544c67-6fbf-4324-bd8a-4f66224c9f22',
    });
    this.client = new OneSignal.DefaultApi(configuration);
  }

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
    // Enviar la notificación a OneSignal
    const notification = {
      app_id: '53544c67-6fbf-4324-bd8a-4f66224c9f22',
      contents: {
        en: descripcion,
      },
      headings: {
        en: titulo,
      },
      included_segments: [canal],
    };

    this.client
      .createNotification(notification)
      .then((response) => {
        console.log('Notification sent successfully:', response.id);
      })
      .catch((e) => {
        console.log('Error sending notification:', e);
      });
  }

  async obtenerNotificacionesNoLeidas(): Promise<Notificacion[]> {
    return await this.notificacionModel.find({ leido: false });
  }
}
