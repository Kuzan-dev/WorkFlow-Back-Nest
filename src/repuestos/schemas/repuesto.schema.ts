import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RepuestoDocument = Repuesto & HydratedDocument<Repuesto>;

@Schema({
  timestamps: true,
})
export class Repuesto {
  @Prop({
    required: true,
  })
  producto: string;

  @Prop({
    required: true,
    trim: true,
  })
  marca: string;

  @Prop()
  cantidad: number;

  @Prop()
  cantidadReserva: number;

  @Prop()
  precio: number;
}

export const RepuestoSchema = SchemaFactory.createForClass(Repuesto);
