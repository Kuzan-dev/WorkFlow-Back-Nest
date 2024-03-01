import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Factura } from './schemas/factura.schema';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectModel(Factura.name)
    private readonly facturaModel: Model<Factura>,
  ) {}

  async create(createDacturaDto: CreateFacturaDto): Promise<Factura> {
    const newFactura = await this.facturaModel.create(createDacturaDto);
    return newFactura.id;
  }

  async getFacturasByDateAndType(
    startDate: Date,
    endDate: Date,
    tipo: string | string[],
  ): Promise<Factura[]> {
    const facturas = await this.facturaModel
      .find({
        fecha: { $gte: startDate, $lt: endDate },
        tipo: { $in: Array.isArray(tipo) ? tipo : [tipo] },
      })
      .exec();

    return facturas || [];
  }

  async getMonthlySummary(inputDate: string): Promise<any[]> {
    const date = new Date(inputDate);
    const promises = [];

    for (let i = 0; i < 12; i++) {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() - i + 1,
        0,
      );

      const ingresosPromise = this.facturaModel.aggregate([
        {
          $match: {
            fecha: { $gte: startOfMonth, $lte: endOfMonth },
            tipo: 'cliente',
          },
        },
        {
          $group: {
            _id: null,
            monto: { $sum: '$monto' },
            igv: { $sum: '$igv' },
          },
        },
      ]);

      const egresosPromise = this.facturaModel.aggregate([
        {
          $match: {
            fecha: { $gte: startOfMonth, $lte: endOfMonth },
            tipo: { $in: ['proveedores', 'auto', 'adicional'] },
          },
        },
        {
          $group: {
            _id: null,
            monto: { $sum: '$monto' },
            igv: { $sum: '$igv' },
          },
        },
      ]);

      const detraccionesPromise = this.facturaModel.aggregate([
        {
          $match: {
            fecha: { $gte: startOfMonth, $lte: endOfMonth },
            tipo: 'auto',
          },
        },
        { $group: { _id: null, detraccion: { $sum: '$detraccion' } } },
      ]);

      promises.push(
        Promise.all([
          ingresosPromise,
          egresosPromise,
          detraccionesPromise,
        ]).then(([ingresos, egresos, detracciones]) => ({
          mesYear: `${startOfMonth.getMonth() + 1}/${startOfMonth.getFullYear()}`,
          ingresoFact: ingresos[0]?.monto || 0,
          egresosFact: egresos[0]?.monto || 0,
          igvIngresos: ingresos[0]?.igv || 0,
          igvEgresos: egresos[0]?.igv || 0,
          detracciones: detracciones[0]?.detraccion || 0,
        })),
      );
    }

    return Promise.all(promises);
  }
}
