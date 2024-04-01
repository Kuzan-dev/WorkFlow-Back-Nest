import { Injectable } from '@nestjs/common';
import {
  Notificacion,
  NotificacionDocument,
} from './schemas/notificacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pubSub } from 'src/shared/pubsub';
@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<NotificacionDocument>,
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
  }

  async obtenerNotificacionesNoLeidas(): Promise<Notificacion[]> {
    return await this.notificacionModel.find({ leido: false });
  }
}
