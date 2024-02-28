import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class RepuestoDto2 {
  @Field()
  @IsNotEmpty()
  @IsString()
  _id: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  cantidadReserva?: number;

  @Field()
  @IsOptional()
  @IsString()
  marca?: string;

  @Field()
  @IsOptional()
  @IsString()
  producto?: string;

  @Field()
  @IsNumber()
  cantidad: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  precio?: number;
  // ...rest of your fields
}

@ObjectType()
export class RepuestoType2 {
  @Field()
  @IsNotEmpty()
  @IsString()
  _id: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  cantidadReserva?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  marca?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  producto?: string;

  @Field()
  @IsNumber()
  cantidad: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  precio?: number;
  // ...rest of your fields
}
