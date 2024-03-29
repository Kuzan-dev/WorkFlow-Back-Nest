import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class Mantenimientos {
  @Field()
  placa: string;

  @Field()
  cliente: string;

  @Field()
  fechaInicio: Date;

  @Field({ nullable: true })
  fechaFin: Date;

  @Field()
  tipo: string;

  @Field()
  repuestoUsados: number;

  @Field()
  costoRepuestos: number;
}

@ObjectType()
export class MantenimientoTableType {
  @Field(() => [Mantenimientos])
  mantenimientos: Mantenimientos[];

  @Field(() => Int)
  totalPages: number;
}
