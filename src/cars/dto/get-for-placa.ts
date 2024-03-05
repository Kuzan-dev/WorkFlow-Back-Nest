import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GetForPlacasDto {
  @Field()
  _id: string;

  @Field()
  placa: string;

  @Field()
  cliente: string;

  @Field()
  tipoContrato: string;

  @Field()
  kmActual: number;

  @Field()
  propietario: string;

  @Field()
  fechaSoat: Date;
}
