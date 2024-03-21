import { ObjectType, Field } from '@nestjs/graphql';
import { Costos } from './costos-mes-prev-correc.dto';
import { KmRecorridoPorMes } from './km-recorrido-mes.dto';
import { RepuestosMasConsumidosPorMes } from './costo-repuesto-mes.dto';
import { OperatividadPorMes } from './operatividad-mes.dto';

@ObjectType()
export class EstadisticWebDTO {
  @Field(() => [KmRecorridoPorMes])
  kmRecorrido: KmRecorridoPorMes[];

  @Field(() => Costos)
  costos: Costos;

  @Field({ nullable: true })
  puntaje: number;

  @Field({ nullable: true })
  cantidadMatenimientos: number;

  @Field({ nullable: true })
  cantidadMatDenegados: number;

  @Field(() => [RepuestosMasConsumidosPorMes])
  repuestosConsumidos: RepuestosMasConsumidosPorMes[];

  @Field(() => [OperatividadPorMes])
  operatividad: OperatividadPorMes[];
}
