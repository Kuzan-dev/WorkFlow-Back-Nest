import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class RepuestoUsado {
  @Field()
  _id: string;

  @Field()
  producto: string;

  @Field(() => Int)
  conteo: number;
}

@ObjectType()
export class ResumenRepuestos {
  @Field()
  mesYear: string;

  @Field(() => [RepuestoUsado])
  repuestos: RepuestoUsado[];

  @Field(() => Int)
  totalOtros: number;
}
