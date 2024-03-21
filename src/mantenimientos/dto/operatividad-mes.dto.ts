import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OperatividadPorMes {
  @Field({ nullable: true })
  mes: string;

  @Field({ nullable: true })
  operatividad: number;
}
