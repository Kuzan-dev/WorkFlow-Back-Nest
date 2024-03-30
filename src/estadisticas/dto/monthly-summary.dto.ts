import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class MonthlySummaryDto {
  @Field({ nullable: true })
  mesYear: string;

  @Field(() => Float, { nullable: true })
  ingresoFact: number;

  @Field(() => Float, { nullable: true })
  egresosTotalFact: number;
}
