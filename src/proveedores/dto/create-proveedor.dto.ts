import { Field, ObjectType, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class ProveedorDto {
  @Field({ nullable: true })
  _id: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;

  @Field()
  direccion: string;

  @Field({ nullable: true })
  nombreContacto: string;

  @Field(() => Int, { nullable: true })
  numeroContacto: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  rubro: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos?: Array<string>;
}

@InputType()
export class ProveedorInput {
  @Field({ nullable: true })
  _id: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;

  @Field()
  direccion: string;

  @Field({ nullable: true })
  nombreContacto: string;

  @Field(() => Int, { nullable: true })
  numeroContacto: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  rubro: string;
}
