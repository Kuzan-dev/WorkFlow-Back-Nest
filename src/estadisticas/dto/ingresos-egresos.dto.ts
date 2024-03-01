import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GeneralReportDto {
  @Field()
  mesYear: string;

  @Field()
  ingresoFact: number;

  @Field()
  egresosFact: number;

  @Field()
  egresosTotalFact: number;

  @Field()
  igvIngresos: number;

  @Field()
  igvEgresos: number;

  @Field()
  detracciones: number;
}
