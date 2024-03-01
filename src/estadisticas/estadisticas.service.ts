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

  async getMonthlySummary(inputDate: Date): Promise<any[]> {
    const promises = Array.from({ length: 12 }, async (_, i) => {
      const monthDate = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth() - i,
        1,
      );
      monthDate.setHours(0, 0, 0, 0);

      const nextMonthDate = new Date(monthDate);
      nextMonthDate.setMonth(monthDate.getMonth() + 1);

      const [facturas, personalTotal, otrosFacturas] = await Promise.all([
        this.facturasService.getFacturasByDateAndType(
          monthDate,
          nextMonthDate,
          ['proveedores', 'autos'],
        ),
        this.personalService.getTotalSalaryAtDate(monthDate),
        this.facturasService.getFacturasByDateAndType(
          monthDate,
          nextMonthDate,
          'otros',
        ),
      ]);

      const fact = facturas.reduce((sum, factura) => sum + factura.monto, 0);
      const igv = facturas.reduce(
        (sum, factura) => sum + (factura.igv || 0),
        0,
      );
      const detraccion = facturas.reduce(
        (sum, factura) => sum + (factura.detraccion || 0),
        0,
      );
      const otros = otrosFacturas.reduce(
        (sum, factura) => sum + factura.monto,
        0,
      );
      const igvOtros = otrosFacturas.reduce(
        (sum, factura) => sum + (factura.igv || 0),
        0,
      );

      return {
        mesYear: `${monthDate.getMonth() + 1}/${monthDate.getFullYear()}`,
        fact,
        igv,
        detraccion,
        personalTotal,
        otros,
        igvOtros,
      };
    });

    return Promise.all(promises);
  }

  async getGeneralReport(inputDate: string): Promise<any[]> {
    const monthlySummary =
      await this.facturasService.getMonthlySummary(inputDate);

    const salaryPromises = monthlySummary.map((month) => {
      const date = new Date(`01/${month.mesYear}`);
      return this.personalService.getTotalSalaryAtDate(date);
    });

    const totalSalaries = await Promise.all(salaryPromises);

    const results = monthlySummary.map((month, index) => ({
      ...month,
      egresosTotalFact: month.egresosFact + totalSalaries[index],
    }));

    return results;
  }
}
