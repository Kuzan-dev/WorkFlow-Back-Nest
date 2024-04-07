import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FacturaDocument = HydratedDocument<Factura>;

@Schema()
export class Factura {
  @Prop({ unique: true })
  numeroFactura: string;

  @Prop()
  monto: number;

  @Prop()
  igv?: number;

  @Prop()
  detraccion?: number;

  @Prop()
  tipo: string;

  @Prop()
  notificacion: boolean;

  @Prop()
  fecha: Date;

  @Prop()
  involucrado?: string; //Cliente o Proveedor

  @Prop([String])
  documentos?: Array<string>;
}

export const FacturaSchema = SchemaFactory.createForClass(Factura);
