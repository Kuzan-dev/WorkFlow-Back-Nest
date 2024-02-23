import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class RepuestoDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

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
