import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';
import { RepuestoDto } from 'src/repuestos/dto/repuesto.dto';

@InputType()
export class UpdateOneMantenimientoDto {
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
  fecha: Date;

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
  @IsNotEmpty()
  @IsNumber()
  kmMedido: number;

  @Field()
  @IsNotEmpty()
  @IsDate()
  fechaInicio: Date;

  @Field()
  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @Field(() => [RepuestoDto])
  @IsArray()
  @IsOptional()
  repuestos?: RepuestoDto[];
}
