import { Resolver, Args, Mutation, Query, Int } from '@nestjs/graphql';
import { ClientesService } from './clientes.service';
import { ContratoInput } from './dto/cliente.input';
import {
  ClienteDto,
  Cliente2Dto,
  Contrato2Dto,
  ContratoIntDto,
} from './dto/cliente.dto';
import { ClienteInput } from './dto/cliente.input';
import { ClienteUserInput } from './dto/cliente-user.input';
import { UsersService } from '../users/users.service';
//Importaciones de Seguridad
import { Roles } from '../auth/roles.decorator';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { UserOutput } from 'src/users/dto/create-user.dto';
import { omit } from 'lodash';
import { ClientesResult } from './dto/search-clientes.dto';
@Resolver()
export class ClientesResolver {
  constructor(
    private clienteService: ClientesService,
    private userService: UsersService,
  ) {}
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => String, {
    name: 'crear_Cliente',
    description:
      'Esta Función registra un nuevo cliente en la base de datos y retorna el id del documento creado',
  })
  async createCliente(
    @Args('cliente', { type: () => ClienteUserInput })
    cliente: ClienteUserInput,
  ): Promise<string> {
    if (
      !cliente.users ||
      cliente.users === null ||
      cliente.users.length === 0
    ) {
      return 'faltaUsers';
    }
    return this.clienteService.createClienteWithUsers(cliente);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => String, {
    name: 'actualizar_Cliente',
    description:
      'Esta Función actualizar un cliente en la base de datos por su id',
  })
  async actualizarCliente(
    @Args('cliente', { type: () => ClienteInput })
    cliente: ClienteInput,
    @Args('id') id: string,
  ): Promise<string> {
    if (!cliente || cliente === null) {
      return 'no hay datos';
    }
    const clientInfo = omit(cliente, 'contratos', '_id');
    const updatedCliente = await this.clienteService.updateCliente(
      id,
      clientInfo,
    );
    if (!updatedCliente) {
      return 'No se encontró ningún cliente con el id proporcionado';
    }
    return 'operación exitosa';
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => Boolean, {
    name: 'borrar_Cliente',
    description:
      'Esta Función elimina un cliente de la base de datos y retorna un booleano indicando si se eliminó correctamente o no',
  })
  async deleteCliente(@Args('id') id: string): Promise<boolean> {
    return this.clienteService.deleteCliente(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => Cliente2Dto, {
    name: 'obtener_Cliente_ID',
    description:
      'Esta Función retorna la información de un cliente en base a su ID',
  })
  async getClienteById(@Args('id') id: string): Promise<Cliente2Dto> {
    const cliente = await this.clienteService.getClienteById(id);

    // Mapear los contratos a Contrato2Dto
    const contratos = cliente.contratos.map((contrato) => {
      return {
        numeroContrato: contrato.numeroContrato,
        fechaInicio: contrato.fechaInicio,
        fechaFin: contrato.fechaFin,
        clienteId: cliente._id, // Aquí asignamos el _id del cliente al campo clienteId del contrato
      } as Contrato2Dto;
    });

    // Mapear el cliente a Cliente2Dto
    const cliente2Dto: Cliente2Dto = {
      _id: cliente._id,
      nombre: cliente.nombre,
      ruc: cliente.ruc,
      direccion: cliente.direccion,
      nombreCliente: cliente.nombreCliente,
      numeroContacto: cliente.numeroContacto,
      email: cliente.email,
      rubro: cliente.rubro,
      contratos: contratos,
      documentos: cliente.documentos,
    };

    return cliente2Dto;
  }
  async addContrato(
    @Args('id') id: string,
    @Args('contrato', { type: () => ContratoInput }) contrato: ContratoInput,
  ): Promise<ClienteDto> {
    return this.clienteService.addContrato(id, contrato);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => [ClienteDto], {
    name: 'obtener_Todos_Clientes',
    description:
      'Esta Función retorna la información de todos los clientes en la base de datos',
  })
  async getAllClientes(): Promise<ClienteDto[]> {
    return this.clienteService.getAllClientes();
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => ClientesResult, {
    name: 'buscar_Clientes',
    description:
      'Esta función retorna la información de los clientes en base a su nombre',
  })
  async searchClientes(
    @Args('nombreCliente') nombreCliente: string,
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ): Promise<ClientesResult> {
    return this.clienteService.searchClientes(nombreCliente, page);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => [UserOutput], {
    name: 'obtener_Usuarios_por_IDcliente',
    description:
      'Esta Función retorna la información de los usuarios asociados a un cliente',
  })
  async getUsersByClienteId(
    @Args('clienteId') clienteId: string,
  ): Promise<UserOutput[]> {
    try {
      return this.clienteService.getUsersByClienteId(clienteId);
    } catch (error) {
      throw new NotFoundException(
        `El cliente con el ID ${clienteId} no existe`,
      );
    }
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => Boolean, {
    name: 'eliminar_Contrato',
    description:
      'Esta Función elimina un contrato de un cliente en la base de datos y retorna el documento actualizado',
  })
  async removeContrato(
    @Args('clienteId') clienteId: string,
    @Args('numeroContrato') numeroContrato: string,
  ): Promise<boolean> {
    try {
      await this.clienteService.removeContrato(clienteId, numeroContrato);
      return true;
    } catch (error) {
      throw new NotFoundException(
        `No se pudo eliminar el contrato del cliente con el ID ${clienteId}`,
      );
    }
  }

  @Mutation(() => String, {
    name: 'agregar_Contrato',
    description:
      'Esta Función agrega un contrato a un cliente en la base de datos',
  })
  async add2Contrato(
    @Args('id') id: string,
    @Args('contrato') contrato: ContratoIntDto,
  ): Promise<string> {
    await this.clienteService.addContrato(id, contrato);
    return 'contrato agregado con exito';
  }
}
