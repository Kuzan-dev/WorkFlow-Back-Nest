import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class Mantenimientos {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  placa: string;

  @Field({ nullable: true })
  cliente: string;

  @Field({ nullable: true })
  fechaInicio: Date;

  @Field({ nullable: true })
  fechaFin: Date;

  @Field({ nullable: true })
  tipo: string;

  @Field({ nullable: true })
  repuestoUsados: number;

  @Field({ nullable: true })
  costoRepuestos: number;
}

@ObjectType()
export class MantenimientoTableType {
  @Field(() => [Mantenimientos])
  mantenimientos: Mantenimientos[];

  @Field(() => Int)
  totalPages: number;
}
