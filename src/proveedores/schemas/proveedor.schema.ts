import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProveedorDocument = Proveedor & Document;

@Schema({
  timestamps: true,
})
export class Proveedor {
  @Prop({
    required: true,
    trim: true,
  })
  nombre: string;

  @Prop({
    required: true,
    trim: true,
  })
  ruc: string;

  @Prop({
    required: true,
    trim: true,
  })
  direccion: string;
  // Datos de Contacto
  @Prop()
  nombreContacto: string;

  @Prop()
  numeroContacto: number;

  @Prop({
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  rubro: string;
  // Información de Contrato

  @Prop([String])
  documentos: Array<string>;
}

export const ProveedorSchema = SchemaFactory.createForClass(Proveedor);
