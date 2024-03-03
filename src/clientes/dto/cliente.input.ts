import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ContratoInput {
  @Field()
  numeroContrato: string;

  @Field()
  fechaInicio: Date;

  @Field()
  fechaFin: Date;
}

@InputType()
export class ClienteInput {
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

  @Field(() => [ContratoInput], { nullable: 'itemsAndList' })
  contratos: ContratoInput[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos: Array<string>;
}
