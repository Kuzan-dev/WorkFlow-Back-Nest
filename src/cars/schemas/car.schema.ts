import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema()
export class Car {
  _id: string;
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  placa: string;

  @Prop()
  propietario: string;

  @Prop()
  cliente: string;

  @Prop()
  tipoContrato: string;

  @Prop()
  fechaSoat: Date;

  @Prop()
  kmActual: number;

  @Prop()
  kmRegistroInicial: number;

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
