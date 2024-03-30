import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CalendarGrafica {
  @Field({ nullable: true })
  fecha: Date;

  @Field({ nullable: true })
  cantidad: number;
}
