import { Injectable } from '@nestjs/common';
//import { CarsService } from 'src/cars/cars.service';
import { FacturasService } from 'src/facturas/facturas.service';
import { MantenimientosService } from 'src/mantenimientos/mantenimientos.service';
import { PersonalService } from 'src/personal/personal.service';
import { OperatividadOut } from './dto/dashboard.dto';
import { IngresosDtoOut } from './dto/dashboard.dto';
import { RepuestosService } from 'src/repuestos/repuestos.service';

@Injectable()
export class EstadisticasService {
  constructor(
    private facturasService: FacturasService,
    private personalService: PersonalService,
    private mantenimientosService: MantenimientosService,
    private repuestosService: RepuestosService,
  ) {}

  async getGastosMensuales(inputDateISO: string): Promise<any[]> {
    const date = new Date(inputDateISO);
    const promises = [];

    const createPromise = (date: Date) => {
      const factPromise = this.facturasService.getGastosFacDelMes(
        new Date(date),
      );
      const personalPromise = this.personalService.getTotalSalaryForMonth(
        date.toISOString(),
      );
      const otrosPromise = this.facturasService.getGastosOtrosDelMes(
        new Date(date),
      );

      return Promise.all([factPromise, personalPromise, otrosPromise]).then(
        ([fact, personalTotal, otros]) => ({
          mesYear: `${date.getMonth() + 1}/${date.getFullYear()}`,
          fact,
          personalTotal,
          otros,
        }),
      );
    };

    for (let i = 0; i < 12; i++) {
      promises.push(createPromise(new Date(date)));
      date.setMonth(date.getMonth() - 1);
    }

    return Promise.all(promises);
  }

  async getIngresosEgresosMensuales(inputDateISO: string): Promise<any[]> {
    const date = new Date(inputDateISO);
    const promises = [];

    const createPromise = (date: Date) => {
      const egresosPromise = this.facturasService.getEgresosDelMes(
        new Date(date),
      );
      const personalPromise = this.personalService.getTotalSalaryForMonth(
        date.toISOString(),
      );
      const ingresosPromise = this.facturasService.getIngresosDelMes(
        new Date(date),
      );

      return Promise.all([
        egresosPromise,
        personalPromise,
        ingresosPromise,
      ]).then(([egresos, personal, ingresos]) => ({
        mesYear: `${date.getMonth() + 1}/${date.getFullYear()}`,
        ingresoFact: ingresos,
        egresosTotalFact: egresos + personal,
      }));
    };

    for (let i = 0; i < 12; i++) {
      promises.push(createPromise(new Date(date)));
      date.setMonth(date.getMonth() - 1);
    }

    return Promise.all(promises);
  }

  async getOperatividadGraf(inputDate: string): Promise<OperatividadOut> {
    const operatividad =
      this.mantenimientosService.getOperatividadHoras(inputDate);
    const operatividadPorcentual =
      this.mantenimientosService.getOperatividadPorcentual(inputDate);
    return Promise.all([operatividad, operatividadPorcentual]).then(
      ([operatividadPorcentual, operatividadHoras]) => {
        return {
          operatividadPorcentual,
          operatividadHoras,
        };
      },
    );
  }

  async getIngresosTabla(inputDate: string): Promise<IngresosDtoOut> {
    const date = new Date(inputDate);
    const ingresos = this.facturasService.getIngresosDelMes(date);
    const detracciones = this.facturasService.getDetraccionesDelMes(date);
    const igv = this.facturasService.getIGVDelMes(date);
    return Promise.all([ingresos, detracciones, igv]).then(
      ([ingresos, detracciones, igv]) => {
        return {
          ingresos,
          detracciones,
          igv,
        };
      },
    );
  }
}
