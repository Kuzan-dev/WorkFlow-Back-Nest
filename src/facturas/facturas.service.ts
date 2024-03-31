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

  async getEgresosDelMes(date: Date): Promise<number> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const egresos = await this.facturaModel.aggregate([
      {
        $match: {
          tipo: {
            $in: [
              'Factura a Propietario Vehicular',
              'Compra Adicional',
              'Compra de Repuestos',
            ],
          },
          fecha: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$monto' },
        },
      },
    ]);

    return egresos[0]?.total || 0;
  }

  async getIngresosDelMes(date: Date): Promise<number> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const ingresos = await this.facturaModel.aggregate([
      {
        $match: {
          tipo: {
            $in: ['Factura a Cliente'],
          },
          fecha: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$monto' },
        },
      },
    ]);
    return ingresos[0]?.total || 0;
  }

  async getDetraccionesDelMes(date: Date): Promise<number> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const detracciones = await this.facturaModel.aggregate([
      {
        $match: {
          tipo: {
            $in: ['Factura a Propietario Vehicular'],
          },
          fecha: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$detraccion' },
        },
      },
    ]);
    return detracciones[0]?.total || 0;
  }

  async getIGVDelMes(date: Date): Promise<number> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const igv = await this.facturaModel.aggregate([
      {
        $match: {
          tipo: {
            $in: [
              'Factura a Propietario Vehicular',
              'Compra de Repuestos',
              'Factura a Cliente',
              'Compra Adicional',
            ],
          },
          fecha: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$igv' },
        },
      },
    ]);
    return igv[0]?.total || 0;
  }

  async getGastosFacDelMes(date: Date): Promise<number> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const egresos = await this.facturaModel.aggregate([
      {
        $match: {
          tipo: {
            $in: ['Factura a Propietario Vehicular', 'Compra de Repuestos'],
          },
          fecha: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$monto' },
        },
      },
    ]);

    return egresos[0]?.total || 0;
  }

  //Obtiene los gastos realizados en compras de repuestos y otros
  async getGastosOtrosDelMes(date: Date): Promise<number> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const egresos = await this.facturaModel.aggregate([
      {
        $match: {
          tipo: {
            $in: ['Compra Adicional'],
          },
          fecha: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$monto' },
        },
      },
    ]);

    return egresos[0]?.total || 0;
  }
}
