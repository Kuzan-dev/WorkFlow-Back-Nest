import { Resolver, Query, Args } from '@nestjs/graphql';
import { EstadisticasService } from './estadisticas.service';
import { MonthlySummaryDto } from './dto/monthly-summary.dto';
import { GeneralReportDto } from './dto/ingresos-egresos.dto';
import { Dashboard } from './dto/dashboard.dto';
import { MantenimientosService } from 'src/mantenimientos/mantenimientos.service';
import { FacturasService } from 'src/facturas/facturas.service';
//Importaciones de Seguridad
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

@Resolver()
export class EstadisticasResolver {
  constructor(
    private estadisticasService: EstadisticasService,
    private mantenimientosService: MantenimientosService,
    private facturasService: FacturasService,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => [GeneralReportDto], {
    name: 'grafica_gastos_generales',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async getGeneralReport(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<GeneralReportDto[]> {
    return this.estadisticasService.getGastosMensuales(inputDate);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => [MonthlySummaryDto], {
    name: 'grafica_ingresos_egresos',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async graficaIngresosEgresos(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<MonthlySummaryDto[]> {
    return this.estadisticasService.getIngresosEgresosMensuales(inputDate);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Query(() => Dashboard, {
    name: 'dashboard_web',
    description: 'Obtiene el resumen mensual de ingresos y egresos',
  })
  async dashboardweb(): Promise<Dashboard> {
    const fechaActual = new Date();
    const fechaActualString = new Date().toISOString();

    const [
      ingresosMensuales,
      mantenimientosRealizados,
      mantenimientosDenegados,
      gastosGenerales,
      operatividad,
      calendario,
      ingresosEgresos,
      repuestosMasConsumidos,
    ] = await Promise.all([
      this.estadisticasService.getIngresosTabla(fechaActualString),
      this.mantenimientosService.getCompletedMaintenancesInMonth(fechaActual),
      this.mantenimientosService.getDenegadosMaintenancesInMonth(fechaActual),
      this.estadisticasService.getGastosMensuales(fechaActualString),
      this.estadisticasService.getOperatividadGraf(fechaActualString),
      this.mantenimientosService.getCalendarGraficaRange(fechaActual),
      this.estadisticasService.getIngresosEgresosMensuales(fechaActualString),
      this.mantenimientosService.getMostConsumedParts(fechaActual),
    ]);
    return {
      ingresosMensuales,
      mantenimientosRealizados,
      mantenimientosDenegados,
      gastosGenerales,
      operatividad,
      calendario,
      ingresosEgresos,
      repuestosMasConsumidos,
    };
  }
}
