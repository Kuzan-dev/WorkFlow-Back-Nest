import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MantenimientoDocument = HydratedDocument<Mantenimiento>;

@Schema()
export class Mantenimiento {
  @Prop({
    required: true,
    trim: true,
  })
  placa: string;

  @Prop()
  tipo: string;

  @Prop()
  tecnico: string;

  @Prop()
  estado: string;

  @Prop()
  kmPrevio: number;

  @Prop()
  kmMedido: number;

  @Prop()
  cliente: string;

  @Prop()
  fecha: Date;

  @Prop()
  fechaInicio: Date;

  @Prop()
  fechaFin: Date;

  @Prop()
  fechaSoat: Date;

  @Prop()
  anotaciones: string;

  @Prop()
  diagnostico: string;

  @Prop()
  diagnosticoFinal: string;

  @Prop([Object])
  repuestos: Array<object>;

  @Prop([Object])
  respuestosAdicionales: Array<object>;

  @Prop([String])
  documentos: Array<string>;
}

export const MantenimientoSchema = SchemaFactory.createForClass(Mantenimiento);
