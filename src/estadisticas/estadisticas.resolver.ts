import { Resolver, Query, Args } from '@nestjs/graphql';
import { EstadisticasService } from './estadisticas.service';
import { MonthlySummaryDto } from './dto/monthly-summary.dto';
import { GeneralReportDto } from './dto/ingresos-egresos.dto';
import { Dashboard } from './dto/dashboard.dto';

@Resolver()
export class EstadisticasResolver {
  constructor(private estadisticasService: EstadisticasService) {}

  @Query(() => [GeneralReportDto], {
    name: 'grafica_gastos_generales',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async getGeneralReport(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<GeneralReportDto[]> {
    return this.estadisticasService.getGastosMensuales(inputDate);
  }

  @Query(() => [MonthlySummaryDto], {
    name: 'grafica_ingresos_egresos',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async graficaIngresosEgresos(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<MonthlySummaryDto[]> {
    return this.estadisticasService.getIngresosEgresosMensuales(inputDate);
  }

  @Query(() => Dashboard, {
    name: 'dashboard_web',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async dashboardweb(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<Dashboard> {
    await this.estadisticasService.getIngresosEgresosMensuales(inputDate);
    return null;
  }
}
