import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HistorialCarData {
  @Field(() => String, { nullable: true })
  placa: string;

  @Field(() => Date, { nullable: true })
  fechaSoat: Date;

  @Field(() => Date, { nullable: true })
  ultimaRevision: Date;

  @Field(() => Date, { nullable: true })
  vigenciaContrato: Date;

  @Field(() => Number, { nullable: true })
  kmActual: number;

  @Field(() => Number, { nullable: true })
  operatividad: number;
}
