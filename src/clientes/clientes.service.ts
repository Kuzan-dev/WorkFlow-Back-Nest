import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClienteDto, ContratoDto } from './dto/cliente.dto';
import { Cliente, ClienteDocument } from './schemas/cliente.schema';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
  ) {}

  async createCliente(cliente: ClienteDto): Promise<string> {
    const newCliente = new this.clienteModel(cliente);
    const result = await newCliente.save();
    return result._id;
  }

  async deleteCliente(id: string): Promise<boolean> {
    const result = await this.clienteModel.findByIdAndDelete(id).exec();
    return result != null;
  }

  async getClienteById(id: string): Promise<ClienteDto> {
    return this.clienteModel.findById(id).exec();
  }

  async addContrato(id: string, contrato: ContratoDto): Promise<Cliente> {
    return this.clienteModel
      .findByIdAndUpdate(id, { $push: { contratos: contrato } }, { new: true })
      .exec();
  }

  async getAllClientes(): Promise<ClienteDto[]> {
    return this.clienteModel.find().exec();
  }
}
