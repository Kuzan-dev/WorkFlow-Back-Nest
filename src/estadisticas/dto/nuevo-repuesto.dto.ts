import { IsString, IsNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NuevoRepuestoDto {
  @Field()
  @IsString()
  marca: string;

  @Field()
  @IsString()
  producto: string;

  @Field()
  @IsNumber()
  cantidad: number;

  @Field()
  @IsNumber()
  precio: number;
}
