import { Resolver, Query, Args } from '@nestjs/graphql';
import { EstadisticasService } from './estadisticas.service';
import { MonthlySummaryDto } from './dto/monthly-summary.dto';
import { GeneralReportDto } from './dto/ingresos-egresos.dto';

@Resolver()
export class EstadisticasResolver {
  constructor(private estadisticasService: EstadisticasService) {}

  @Query(() => [MonthlySummaryDto], {
    name: 'grafica_gastos_generales',
    description: 'Obtiene el resumen mensual de gastos',
  })
  async getMonthlySummary(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ) {
    const date = new Date(inputDate);
    return this.estadisticasService.getMonthlySummary(date);
  }

  @Query(() => [GeneralReportDto], {
    name: 'grafica_ingresos_egresos',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async getGeneralReport(
    @Args('inputDate') inputDate: string,
  ): Promise<GeneralReportDto[]> {
    return this.estadisticasService.getGeneralReport(inputDate);
  }
}
