import { IsString, IsNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRepuestoDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsNumber()
  cantidad: number;

  @Field()
  @IsNumber()
  precio: number;
}

@InputType()
export class UpdateRepuestoStringDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsString()
  cantidad: string;

  @Field()
  @IsString()
  precio: string;
}
