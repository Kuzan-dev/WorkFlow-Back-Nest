import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificacionDocument = HydratedDocument<Notificacion>;

@Schema()
export class Notificacion {
  _id: string;

  @Prop({
    required: true,
    trim: true,
  })
  titulo: string;

  @Prop()
  tipo: string;

  @Prop()
  descripcion: string;

  @Prop()
  identificador: string;

  @Prop()
  fecha: Date;

  @Prop()
  leido: boolean;
}

export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);
