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
}
