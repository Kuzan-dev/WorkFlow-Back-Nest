import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NuevoRepuestoDto {
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
