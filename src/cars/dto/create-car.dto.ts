import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';

@InputType()
export class CreateCarDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  placa: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  propietario: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cliente: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  fechaSoat: Date;

  @Field(() => Int)
  @IsString()
  @IsNotEmpty()
  kmRegistroInicial: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  tipoContrato: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  fechaRevision: Date;

  @Field()
  @IsDate()
  @IsNotEmpty()
  vigenciaContrato: Date;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  puntaje: number;
}
