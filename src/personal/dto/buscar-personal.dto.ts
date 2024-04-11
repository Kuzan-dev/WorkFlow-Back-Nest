import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class SalarioFechaBusDto {
  @Field(() => Float)
  salario: number;

  @Field()
  fecha: Date;
}

@ObjectType()
export class PersonalBusDto {
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

  @Field(() => [SalarioFechaBusDto], { nullable: 'itemsAndList' })
  salarioFecha: SalarioFechaBusDto[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos?: Array<string>;

  @Field()
  id_user: string;
}
