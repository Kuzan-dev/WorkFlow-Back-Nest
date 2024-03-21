import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RepuestoConsumido {
  @Field({ nullable: true })
  producto: string;

  @Field({ nullable: true })
  costo: number;
}
