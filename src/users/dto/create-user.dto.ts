import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field({ nullable: true })
  _id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  clienteAsociado: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  nivelUser: string;
}

@ObjectType()
export class UserOutput {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  clienteAsociado?: string;

  @Field()
  nivelUser: string;
}
