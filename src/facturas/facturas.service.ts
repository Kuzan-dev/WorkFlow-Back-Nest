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
}
