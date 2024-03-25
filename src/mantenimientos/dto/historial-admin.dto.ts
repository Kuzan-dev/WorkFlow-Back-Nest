import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HistorialCarData {
  @Field(() => String)
  placa: string;

  @Field(() => Date)
  fechaSoat: Date;

  @Field(() => Date, { nullable: true })
  ultimaRevision: Date;

  @Field(() => Date)
  vigenciaContrato: Date;

  @Field(() => Number)
  kmActual: number;

  @Field(() => Number)
  operatividad: number;
}
