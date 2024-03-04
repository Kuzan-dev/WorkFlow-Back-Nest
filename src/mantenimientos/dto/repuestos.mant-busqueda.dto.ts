import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class ProductoConsumido {
  @Field()
  producto: string;

  @Field(() => Int)
  cantidadConsumida: number;
}

@ObjectType()
export class MesRepuestos {
  @Field()
  mesYear: string;

  @Field(() => ProductoConsumido, { nullable: true })
  prod1?: ProductoConsumido;

  @Field(() => ProductoConsumido, { nullable: true })
  prod2?: ProductoConsumido;

  @Field(() => ProductoConsumido, { nullable: true })
  prod3?: ProductoConsumido;

  @Field(() => ProductoConsumido, { nullable: true })
  prod4?: ProductoConsumido;

  @Field(() => ProductoConsumido, { nullable: true })
  prod5?: ProductoConsumido;

  @Field(() => ProductoConsumido, { nullable: true })
  otros?: ProductoConsumido;
}
