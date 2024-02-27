import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Mantenimiento } from '../schemas/mantenimiento.schema';

@ObjectType()
export class HomeTecnico {
  @Field(() => Int)
  mantRevision: number;

  @Field(() => [Mantenimiento])
  mantTotalesPorDia: Mantenimiento[];

  @Field(() => [Mantenimiento])
  mantCompletadosPorDia: Mantenimiento[];
}
