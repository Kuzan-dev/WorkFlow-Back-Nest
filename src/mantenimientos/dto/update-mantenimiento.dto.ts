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
export class UpdateMantenimientoDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  _id: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  kmMedido: number;

  @Field()
  @IsDate()
  fechaInicio: Date;

  @Field()
  @IsDate()
  fecha: Date;

  @Field()
  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @Field(() => [RepuestoDto], { nullable: true })
  @IsArray()
  @IsOptional()
  repuestos?: RepuestoDto[];
}
