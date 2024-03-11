import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRepuestoAjusteDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  marca: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  producto: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  precio: number;
}
