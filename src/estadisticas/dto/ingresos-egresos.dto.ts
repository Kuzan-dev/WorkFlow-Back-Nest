import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GeneralReportDto {
  @Field({ nullable: true })
  mesYear: string;

  @Field({ nullable: true })
  fact: number;

  @Field({ nullable: true })
  personalTotal: number;

  @Field({ nullable: true })
  otros: number;
}
