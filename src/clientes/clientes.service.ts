import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClienteDto, ContratoDto } from './dto/cliente.dto';
import { Cliente, ClienteDocument } from './schemas/cliente.schema';
import { UsersService } from 'src/users/users.service';
import { UserOutput } from 'src/users/dto/create-user.dto';
import { omit } from 'lodash';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
    private usersService: UsersService,
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
  async updateCliente(
    id: string,
    cliente: ClienteDto,
  ): Promise<ClienteDto | null> {
    const clienteToUpdate = omit(cliente, 'contratos');
    const updatedCliente = await this.clienteModel
      .findByIdAndUpdate(id, clienteToUpdate, { new: true })
      .exec();
    return updatedCliente;
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

  async searchClientes(nombreCliente: string): Promise<Cliente[]> {
    // eslint-disable-next-line prettier/prettier
    if (nombreCliente === '') {
      return this.clienteModel.find().exec();
    } else {
      return this.clienteModel
        .find({ nombreCliente: new RegExp(nombreCliente, 'i') })
        .exec();
    }
  }

  async getUsersByClienteId(clienteId: string): Promise<UserOutput[]> {
    const cliente = await this.clienteModel.findById(clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const users = await this.usersService.getUsersByClienteName(
      cliente.nombreCliente,
    );
    return users;
  }
}
