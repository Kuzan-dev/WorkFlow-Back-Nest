import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import { Cliente } from '../clientes/schemas/cliente.schema';
import { Factura } from '../facturas/schemas/factura.schema';
import { Mantenimiento } from '../mantenimientos/schemas/mantenimiento.schema';
import { Car } from '../cars/schemas/car.schema';
import { Personal } from '../personal/schemas/personal.schema';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectModel('Cliente') private readonly clienteModel: Model<Cliente>,
    @InjectModel('Factura') private readonly facturaModel: Model<Factura>,
    @InjectModel('Personal') private readonly personalModel: Model<Personal>,
    @InjectModel('Mantenimiento')
    private readonly mantenimientoModel: Model<Mantenimiento>,
    @InjectModel('Car') private readonly carModel: Model<Car>,
  ) {}

  async saveFiles(
    files: { files: Express.Multer.File[] },
    query1: string,
    query2: string,
  ): Promise<string[]> {
    if (query2 === undefined) {
      throw new Error('Se requiere un ID de documento.');
    }
    const paths = files.files.map((file) =>
      join('uploads', query1, query2, file.originalname),
    );
    console.log('Paths:', paths); // Log the paths

    let model: Model<any>;
    switch (query1) {
      case 'clientes':
        model = this.clienteModel;
        break;
      case 'facturas':
        model = this.facturaModel;
        break;
      case 'personals':
        model = this.personalModel;
        break;
      case 'mantenimientos':
        model = this.mantenimientoModel;
        break;
      case 'cars':
        model = this.carModel;
        break;
      default:
        throw new Error('Modelo no encontrado.');
    }

    const documento = await model.findById(query2);
    console.log('Documento antes de actualizar:', documento);
    if (!documento) {
      throw new Error('Documento no encontrado.');
    }
    // documento.documentos = paths;
    // await documento.save();
    // console.log('Documento:', documento);

    await model.updateOne(
      { _id: query2 },
      { $push: { documentos: { $each: paths } } },
    );

    const updatedDocumento = await model.findById(query2);
    console.log('Documento:', updatedDocumento);

    return paths;
  }

  async deleteFileReference(
    query1: string,
    query2: string,
    filePath: string,
  ): Promise<void> {
    let model: Model<any>;
    switch (query1) {
      case 'clientes':
        model = this.clienteModel;
        break;
      case 'facturas':
        model = this.facturaModel;
        break;
      case 'personals':
        model = this.personalModel;
        break;
      case 'mantenimientos':
        model = this.mantenimientoModel;
        break;
      case 'cars':
        model = this.carModel;
        break;
      default:
        throw new Error('Modelo no encontrado.');
    }

    const documento = await model.findById(query2);
    if (!documento) {
      throw new Error('Documento no encontrado.');
    }

    await model.updateOne({ _id: query2 }, { $pull: { documentos: filePath } });
  }
}
