import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Repuesto } from 'src/repuestos/schemas/repuesto.schema';

export type MantenimientoDocument = HydratedDocument<Mantenimiento>;

@Schema()
export class Mantenimiento {
  _id: string;

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

  @Prop()
  cambiosSolicitados: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Repuesto' }] })
  repuestos: Repuesto[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Repuesto' }] })
  repuestosAjuste: Repuesto[];

  @Prop([String])
  documentos: Array<string>;
}

export const MantenimientoSchema = SchemaFactory.createForClass(Mantenimiento);
