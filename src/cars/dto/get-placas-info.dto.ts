import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GetPlacasDto {
  @Field()
  _id: string;

  @Field()
  placa: string;

  @Field()
  cliente: string;

  @Field()
  fechaSoat: Date;
}
