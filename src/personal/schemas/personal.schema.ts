import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class SalarioFecha {
  @Prop({ type: Number, required: true })
  salario: number;

  @Prop({ type: Date, required: true })
  fecha: Date;
}

@Schema()
export class Personal {
  _id: string;

  @Prop({ type: String, required: true })
  nombre: string;

  @Prop({ type: Number })
  numero: number;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Date })
  fechaIngreso: Date;

  @Prop({ type: [SalarioFecha], default: [] })
  salarioFecha: SalarioFecha[];

  @Prop([String])
  documentos?: Array<string>;
}

export type PersonalDocument = Personal & Document;
export const PersonalSchema = SchemaFactory.createForClass(Personal);
