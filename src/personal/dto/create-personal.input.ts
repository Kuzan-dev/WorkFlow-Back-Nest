import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class SalarioFechaInput {
  @Field(() => Float)
  salario: number;

  @Field()
  fecha: Date;
}

@InputType()
export class PersonalInput {
  @Field()
  _id: string;

  @Field()
  nombre: string;

  @Field(() => Int, { nullable: true })
  numero: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  fechaIngreso: Date;

  @Field(() => [SalarioFechaInput], { nullable: 'itemsAndList' })
  salarioFecha: SalarioFechaInput[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos?: Array<string>;
}
