import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  clienteAsociado: string;

  @Prop({
    required: true,
    enum: ['admin', 'tecnico', 'cliente'],
    default: 'cliente',
  })
  nivelUser: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
