import { ObjectType, Field } from '@nestjs/graphql';
import { Costos } from './costos-mes-prev-correc.dto';
import { KmRecorridoPorMes } from './km-recorrido-mes.dto';
import { RepuestosMasConsumidosPorMes } from './costo-repuesto-mes.dto';
import { OperatividadPorMes } from './operatividad-mes.dto';

@ObjectType()
export class EstadisticWebDTO {
  @Field(() => [KmRecorridoPorMes], { nullable: true })
  kmRecorrido: KmRecorridoPorMes[];

  @Field(() => Costos, { nullable: true })
  costos: Costos;

  @Field({ nullable: true })
  puntaje: number;

  @Field({ nullable: true })
  placa: string;

  @Field({ nullable: true })
  cantidadMatenimientos: number;

  @Field({ nullable: true })
  cantidadMatDenegados: number;

  @Field(() => [RepuestosMasConsumidosPorMes], { nullable: true })
  repuestosConsumidos: RepuestosMasConsumidosPorMes[];

  @Field(() => [OperatividadPorMes], { nullable: true })
  operatividad: OperatividadPorMes[];
}
