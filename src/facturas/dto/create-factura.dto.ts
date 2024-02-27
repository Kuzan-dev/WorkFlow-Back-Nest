import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFacturaDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  numeroFactura?: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  igv?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  detraccion?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  tipo: string; //Egreso o Ingreso

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  notificacion: boolean; //Activa o Inactiva

  @Field()
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  involucrado?: string; //Cliente o Proveedor

  @Field(() => [String], { nullable: true })
  @IsOptional()
  documentos?: Array<string>;
}
