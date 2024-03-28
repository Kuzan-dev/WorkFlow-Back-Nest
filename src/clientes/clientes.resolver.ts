import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { ClientesService } from './clientes.service';
import { ContratoInput } from './dto/cliente.input';
import { ClienteDto } from './dto/cliente.dto';
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

@Resolver()
export class ClientesResolver {
  constructor(
    private clienteService: ClientesService,
    private userService: UsersService,
  ) {}
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
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
    const clientInfo = await this.clienteService.createCliente(cliente.cliente);
    await Promise.all(
      cliente.users.map((user) => this.userService.create(user)),
    );
    return clientInfo;
  }

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
  @Roles('admin', 'tecnico')
  @Mutation(() => Boolean, {
    name: 'borrar_Cliente',
    description:
      'Esta Función elimina un cliente de la base de datos y retorna un booleano indicando si se eliminó correctamente o no',
  })
  async deleteCliente(@Args('id') id: string): Promise<boolean> {
    return this.clienteService.deleteCliente(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Query(() => ClienteDto, {
    name: 'obtener_Cliente_ID',
    description:
      'Esta Función retorna la información de un cliente en base a su ID',
  })
  async getClienteById(@Args('id') id: string): Promise<ClienteDto> {
    return this.clienteService.getClienteById(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Mutation(() => ClienteDto, {
    name: 'Agregar_Contrato_Cliente',
    description:
      'Esta Función agrega un nuevo contrato al cliente en la base de datos y retorna el documento actualizado',
  })
  async addContrato(
    @Args('id') id: string,
    @Args('contrato', { type: () => ContratoInput }) contrato: ContratoInput,
  ): Promise<ClienteDto> {
    return this.clienteService.addContrato(id, contrato);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Query(() => [ClienteDto], {
    name: 'obtener_Todos_Clientes',
    description:
      'Esta Función retorna la información de todos los clientes en la base de datos',
  })
  async getAllClientes(): Promise<ClienteDto[]> {
    return this.clienteService.getAllClientes();
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Query(() => [ClienteDto], {
    name: 'buscar_Clientes',
    description:
      'Esta Función retorna la información de los clientes en base a su nombre',
  })
  async searchClientes(
    @Args('nombreCliente') nombreCliente: string,
  ): Promise<ClienteDto[]> {
    return this.clienteService.searchClientes(nombreCliente);
  }

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
}
