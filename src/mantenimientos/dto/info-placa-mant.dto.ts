import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CarInfo {
  @Field()
  id: string;

  @Field()
  placa: string;

  @Field()
  fechaSoat: Date;

  @Field()
  vigenciaContrato: Date;

  @Field()
  cliente: string;

  @Field()
  propietario: string;

  @Field()
  kmActual: number;

  @Field()
  Puntaje: number;

  @Field(() => [MantenimientoInfo], { nullable: true })
  Mantenimientos: MantenimientoInfo[];
}

@ObjectType()
export class MantenimientoInfo {
  @Field()
  id: string;

  @Field()
  fecha: Date;

  @Field()
  tipo: string;

  @Field()
  repuestosUsados: number;
}
