import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MantenimientoTableType {
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
