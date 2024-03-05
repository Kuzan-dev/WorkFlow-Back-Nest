import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class PrograMantenimientoDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  placa: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  tecnico: string;

  @Field()
  @IsString()
  fechaSoat: Date;

  @Field()
  @IsNumber()
  kmPrevio: number;

  @Field()
  @IsString()
  Cliente: string;

  @Field()
  @IsString()
  fecha: Date;

  @Field()
  @IsString()
  @IsNotEmpty()
  anotaciones?: string;
}
