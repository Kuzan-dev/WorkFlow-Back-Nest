import { ObjectType, Field } from '@nestjs/graphql';
import { GeneralReportDto } from './ingresos-egresos.dto';
import { CalendarGrafica } from 'src/mantenimientos/dto/calendar-graph.dt';
import { MonthlySummaryDto } from './monthly-summary.dto';
import { MesRepuestos } from 'src/mantenimientos/dto/repuestos.mant-busqueda.dto';
@ObjectType()
class Operatividad {
  @Field({ nullable: true })
  operatividadPorcentual: number;

  @Field({ nullable: true })
  operatividadHoras: number;
}

@ObjectType()
export class Dashboard {
  @Field({ nullable: true })
  ingresosMensuales: number;

  @Field({ nullable: true })
  mantenimientosRealizados: number;

  @Field({ nullable: true })
  mantenimientosCancelados: number;

  @Field(() => [GeneralReportDto], { nullable: true })
  gastosGenerales: GeneralReportDto[];

  @Field(() => Operatividad, { nullable: true })
  operatividad: Operatividad;

  @Field(() => [CalendarGrafica], { nullable: true })
  calendario: CalendarGrafica[];

  @Field(() => [MonthlySummaryDto], { nullable: true })
  ingresosEgresos: MonthlySummaryDto[];

  @Field(() => MesRepuestos, { nullable: true })
  repuestos: MesRepuestos;
}
