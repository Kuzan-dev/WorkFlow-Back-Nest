import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Factura } from './schemas/factura.schema';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';

@Injectable()
export class FacturasService {
  constructor(
    @InjectModel(Factura.name)
    private readonly facturaModel: Model<Factura>,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async create(createDacturaDto: CreateFacturaDto): Promise<string> {
    if (createDacturaDto.numeroFactura == '') {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;

      createDacturaDto.numeroFactura = `compra adicional ${formattedDate}`;
    }
    const newFactura = await this.facturaModel.create(createDacturaDto);
    await this.notificacionesService.crearNotificacion(
      'Notificacion-admin',
      'factura',
      newFactura.id.toString(),
      'Facturación',
      `Se ha registrado una ${newFactura.tipo} con monto de S/. ${newFactura.monto}`,
      new Date(),
      false,
    );
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
  async searchFactura(numeroFactura: string): Promise<Factura[]> {
    let query = {};

    // Si numeroFactura no está vacío, busca por numeroFactura
    if (numeroFactura !== '') {
      query = { numeroFactura: new RegExp(numeroFactura, 'i') };
    }

    const facturas = await this.facturaModel.find(query);
    return facturas;
  }
}
