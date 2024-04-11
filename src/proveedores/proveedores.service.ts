import { Injectable } from '@nestjs/common';
import { Proveedor, ProveedorDocument } from './schemas/proveedor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectModel(Proveedor.name)
    private proveedorModel: Model<ProveedorDocument>,
  ) {}

  async createProveedor(proveedor: ProveedorDto): Promise<Proveedor> {
    const newProveedor = new this.proveedorModel(proveedor);
    return newProveedor.save();
  }

  async searchProveedor(
    nombre: string,
    page?: number,
  ): Promise<{ proveedor: ProveedorDto[]; totalPages: number }> {
    const limit = 8;
    const skip = page && page > 0 ? (page - 1) * limit : 0;

    const query = nombre === '' ? {} : { nombre: new RegExp(nombre, 'i') };

    const totalDocuments = await this.proveedorModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const proveedor = await this.proveedorModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      proveedor,
      totalPages,
    };
  }

  async deleteProveedor(id: string): Promise<boolean> {
    const result = await this.proveedorModel.findByIdAndDelete(id).exec();
    return result != null;
  }

  async findAllProveedorNames(): Promise<string[]> {
    const proveedores = await this.proveedorModel.find().exec();
    return proveedores.map((proveedor) => proveedor.nombre);
  }
}
