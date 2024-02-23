import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema()
export class Car {
  @Prop({
    required: true,
    trim: true,
  })
  placa: string;

  @Prop()
  propietario: string;

  @Prop()
  cliente: string;

  @Prop()
  fechaSoat: Date;

  @Prop()
  kmActual: number;

  @Prop()
  fechaRevision: Date;

  @Prop()
  vigenciaContrato: Date;

  @Prop()
  puntaje: number;

  @Prop([String])
  documentos: Array<string>;
}

export const CarSchema = SchemaFactory.createForClass(Car);
