import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class SalarioFechaDto {
  @Field(() => Float)
  salario: number;

  @Field()
  fecha: Date;
}

@ObjectType()
export class PersonalDto {
  @Field({ nullable: true })
  _id: string;

  @Field()
  nombre: string;

  @Field(() => Int, { nullable: true })
  numero: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  fechaIngreso: Date;

  @Field(() => [SalarioFechaDto], { nullable: 'itemsAndList' })
  salarioFecha: SalarioFechaDto[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos?: Array<string>;
}
