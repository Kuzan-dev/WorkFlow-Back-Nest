import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class KmRecorridoPorMes {
  @Field({ nullable: true })
  mes: string;

  @Field({ nullable: true })
  kmRecorridoTotal: number;
}
