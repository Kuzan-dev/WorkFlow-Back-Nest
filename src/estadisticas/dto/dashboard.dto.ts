import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GeneralReportDto } from './ingresos-egresos.dto';
import { CalendarGrafica } from 'src/mantenimientos/dto/calendar-graph.dt';
import { MonthlySummaryDto } from './monthly-summary.dto';

@ObjectType()
export class OperatividadOut {
  @Field({ nullable: true })
  operatividadPorcentual: number;

  @Field({ nullable: true })
  operatividadHoras: number;
}

@ObjectType()
export class IngresosDtoOut {
  @Field({ nullable: true })
  ingresos: number;

  @Field({ nullable: true })
  detracciones: number;

  @Field({ nullable: true })
  igv: number;
}

@ObjectType()
export class ProductoConsumidoDash {
  @Field()
  producto: string;

  @Field(() => Int)
  cantidadConsumida: number;
}

@ObjectType()
export class DashRepuestos {
  @Field(() => ProductoConsumidoDash, { nullable: true })
  prod1?: ProductoConsumidoDash;

  @Field(() => ProductoConsumidoDash, { nullable: true })
  prod2?: ProductoConsumidoDash;

  @Field(() => ProductoConsumidoDash, { nullable: true })
  prod3?: ProductoConsumidoDash;

  @Field(() => ProductoConsumidoDash, { nullable: true })
  prod4?: ProductoConsumidoDash;

  @Field(() => ProductoConsumidoDash, { nullable: true })
  prod5?: ProductoConsumidoDash;

  @Field(() => ProductoConsumidoDash, { nullable: true })
  otros?: ProductoConsumidoDash;
}

@ObjectType()
export class Dashboard {
  @Field(() => IngresosDtoOut, { nullable: true })
  ingresosMensuales: IngresosDtoOut;

  @Field({ nullable: true })
  mantenimientosRealizados: number;

  @Field({ nullable: true })
  mantenimientosDenegados: number;

  @Field(() => [GeneralReportDto], { nullable: true })
  gastosGenerales: GeneralReportDto[];

  @Field(() => OperatividadOut, { nullable: true })
  operatividad: OperatividadOut;

  @Field(() => [CalendarGrafica], { nullable: true })
  calendario: CalendarGrafica[];

  @Field(() => [MonthlySummaryDto], { nullable: true })
  ingresosEgresos: MonthlySummaryDto[];

  @Field(() => DashRepuestos, { nullable: true })
  repuestosMasConsumidos: DashRepuestos;
}
