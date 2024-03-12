import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class RepuestoSearchType {
  @Field({ nullable: true })
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
