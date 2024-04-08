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

@InputType()
export class NuevoRepuestoStringDto {
  @Field()
  @IsString()
  marca: string;

  @Field()
  @IsString()
  producto: string;

  @Field()
  @IsString()
  cantidad: string;

  @Field()
  @IsString()
  precio: string;
}
