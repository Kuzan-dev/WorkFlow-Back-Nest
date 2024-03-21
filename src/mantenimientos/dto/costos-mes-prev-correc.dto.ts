import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Costos {
  @Field({ nullable: true })
  costoTotal: number;

  @Field({ nullable: true })
  costoPreventivos: number;

  @Field({ nullable: true })
  costoCorrectivos: number;

  @Field({ nullable: true })
  costoMesPasado: number;
}
