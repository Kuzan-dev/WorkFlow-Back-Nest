import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema({
  timestamps: true,
})
export class Cliente {
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
  nombreCliente: string;

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

  @Prop()
  numeroContrato: string;

  @Prop()
  fechaInicio: Date;

  @Prop()
  fechaFin: Date;

  //Información de Documentos

  @Prop([String])
  documentos: Array<string>;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
