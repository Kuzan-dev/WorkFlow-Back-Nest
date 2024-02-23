import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRepuestoDto {
  @Field()
  @IsNumber()
  cantidadReserva?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  marca: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  producto: string;

  @Field()
  @IsNumber()
  cantidad: number;

  @Field()
  @IsNumber()
  precio: number;
}
