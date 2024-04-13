import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClienteDto, ContratoDto } from './dto/cliente.dto';
import { Cliente, ClienteDocument } from './schemas/cliente.schema';
import { UsersService } from 'src/users/users.service';
import { UserOutput } from 'src/users/dto/create-user.dto';
import { omit } from 'lodash';
import { ClienteUserInput } from './dto/cliente-user.input';
import { ClientSession } from 'mongoose';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
    private usersService: UsersService,
  ) {}

  async createClienteWithUsers(cliente: ClienteUserInput): Promise<string> {
    const session = await this.clienteModel.db.startSession();
    session.startTransaction();
    try {
      const clientInfo = await this.createCliente2(cliente.cliente, session);
      await Promise.all(
        cliente.users.map((user) => this.usersService.create2(user, session)),
      );
      await session.commitTransaction();
      return clientInfo;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  async getNombreCliente(id: string): Promise<string> {
    const cliente = await this.clienteModel.findById(id).exec();
    return cliente.nombreCliente;
  }

  async createCliente2(
    cliente: ClienteDto,
    session?: ClientSession,
  ): Promise<string> {
    const newCliente = new this.clienteModel(cliente);
    const result = await newCliente.save({ session });
    return result._id;
  }
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

  async searchClientes(
    nombreCliente: string,
    page?: number,
  ): Promise<{ clientes: Cliente[]; totalPages: number }> {
    const limit = 8;
    const skip = page && page > 0 ? (page - 1) * limit : 0;

    const query =
      nombreCliente === ''
        ? {}
        : { nombreCliente: new RegExp(nombreCliente, 'i') };

    const totalDocuments = await this.clienteModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const clientes = await this.clienteModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      clientes,
      totalPages,
    };
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

  async removeContrato(
    clienteId: string,
    numeroContrato: string,
  ): Promise<Cliente> {
    const updatedCliente = await this.clienteModel
      .updateOne(
        { _id: clienteId },
        { $pull: { contratos: { numeroContrato: numeroContrato } } },
      )
      .exec();

    if (!updatedCliente.modifiedCount) {
      throw new Error('No se pudo eliminar el contrato');
    }

    return this.clienteModel.findById(clienteId).exec();
  }
}
