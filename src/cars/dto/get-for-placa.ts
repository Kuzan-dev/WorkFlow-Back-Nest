import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GetForPlacasDto {
  @Field({ nullable: true })
  _id?: string;

  @Field({ nullable: true })
  placa?: string;

  @Field({ nullable: true })
  cliente?: string;

  @Field({ nullable: true })
  tipoContrato?: string;

  @Field({ nullable: true })
  kmActual?: number;

  @Field({ nullable: true })
  propietario?: string;

  @Field({ nullable: true })
  fechaSoat?: Date;
}
