import { Injectable } from '@nestjs/common';
//import { CarsService } from 'src/cars/cars.service';
import { FacturasService } from 'src/facturas/facturas.service';
import { PersonalService } from 'src/personal/personal.service';
@Injectable()
export class EstadisticasService {
  constructor(
    private facturasService: FacturasService,
    private personalService: PersonalService,
  ) {}

  async getGastosMensuales(inputDateISO: string): Promise<any[]> {
    const date = new Date(inputDateISO);
    const promises = [];

    for (let i = 0; i < 12; i++) {
      date.setMonth(date.getMonth() - 1);

      const factPromise = this.facturasService.getGastosFacDelMes(
        new Date(date),
      );
      const personalPromise = this.personalService.getTotalSalaryForMonth(
        date.toISOString(),
      );
      const otrosPromise = this.facturasService.getGastosOtrosDelMes(
        new Date(date),
      );

      promises.push(
        Promise.all([factPromise, personalPromise, otrosPromise]).then(
          ([fact, personalTotal, otros]) => ({
            mesYear: `${date.getMonth() + 1}/${date.getFullYear()}`,
            fact,
            personalTotal,
            otros,
          }),
        ),
      );
    }

    return Promise.all(promises);
  }

  async getIngresosEgresosMensuales(inputDateISO: string): Promise<any[]> {
    const inputDate = new Date(inputDateISO);
    const promises = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth() - i,
        1,
      );
      const egresosPromise = this.facturasService.getEgresosDelMes(date);
      const personalPromise = this.personalService.getTotalSalaryForMonth(
        date.toISOString(),
      );
      const ingresosPromise = this.facturasService.getIngresosDelMes(date);

      promises.push(
        Promise.all([egresosPromise, personalPromise, ingresosPromise]).then(
          ([egresos, personal, ingresos]) => ({
            mesYear: `${date.getMonth() + 1}/${date.getFullYear()}`,
            ingresoFact: ingresos,
            egresosTotalFact: egresos + personal,
          }),
        ),
      );
    }

    return Promise.all(promises);
  }
}
