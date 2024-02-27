import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FacturaDocument = HydratedDocument<Factura>;

@Schema()
export class Factura {
  @Prop()
  numeroFactura?: string;

  @Prop()
  monto: number;

  @Prop()
  igv?: number;

  @Prop()
  detraccion?: number;

  @Prop()
  tipo: string; //Egreso o Ingreso

  @Prop()
  notificacion: boolean; //Activa o Inactiva

  @Prop()
  fecha: Date;

  @Prop()
  involucrado?: string; //Cliente o Proveedor

  @Prop([String])
  documentos?: Array<string>;
}

export const FacturaSchema = SchemaFactory.createForClass(Factura);
