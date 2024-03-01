import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReporteAnuaFactDto {
  @Field()
  mesYear: string;

  @Field()
  ingresoFact: number;

  @Field()
  egresosFact: number;

  @Field()
  igvIngresos: number;

  @Field()
  igvEgresos: number;

  @Field()
  detracciones: number;
}
