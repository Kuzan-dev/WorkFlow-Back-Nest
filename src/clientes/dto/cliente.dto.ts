import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContratoDto {
  @Field()
  numeroContrato: string;

  @Field()
  fechaInicio: Date;

  @Field()
  fechaFin: Date;
}

@ObjectType()
export class ClienteDto {
  @Field({ nullable: true })
  _id: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;

  @Field()
  direccion: string;

  @Field({ nullable: true })
  nombreCliente: string;

  @Field({ nullable: true })
  numeroContacto: number;

  @Field()
  email: string;

  @Field()
  rubro: string;

  @Field(() => [ContratoDto], { nullable: 'itemsAndList' })
  contratos?: ContratoDto[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos: Array<string>;
}

@ObjectType()
export class Contrato2Dto {
  @Field()
  numeroContrato: string;

  @Field()
  fechaInicio: Date;

  @Field()
  fechaFin: Date;

  @Field()
  clienteId: string;
}

@ObjectType()
export class Cliente2Dto {
  @Field({ nullable: true })
  _id: string;

  @Field()
  nombre: string;

  @Field()
  ruc: string;

  @Field()
  direccion: string;

  @Field({ nullable: true })
  nombreCliente: string;

  @Field({ nullable: true })
  numeroContacto: number;

  @Field()
  email: string;

  @Field()
  rubro: string;

  @Field(() => [Contrato2Dto], { nullable: 'itemsAndList' })
  contratos?: Contrato2Dto[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos: Array<string>;
}
