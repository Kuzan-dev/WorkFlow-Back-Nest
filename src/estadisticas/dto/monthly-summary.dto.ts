import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class MonthlySummaryDto {
  @Field()
  mesYear: string;

  @Field(() => Float)
  fact: number;

  @Field(() => Float)
  igv: number;

  @Field(() => Float)
  detraccion: number;

  @Field(() => Float)
  igvOtros: number;

  @Field(() => Float)
  personalTotal: number;

  @Field(() => Float)
  otros: number;
}
