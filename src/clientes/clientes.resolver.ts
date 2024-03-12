import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { ClientesService } from './clientes.service';
import { ClienteInput, ContratoInput } from './dto/cliente.input';
import { ClienteDto } from './dto/cliente.dto';

@Resolver()
export class ClientesResolver {
  constructor(private clienteService: ClientesService) {}

  @Mutation(() => String, {
    name: 'crear_Cliente',
    description:
      'Esta Función registra un nuevo cliente en la base de datos y retorna el id del documento creado',
  })
  async createCliente(
    @Args('cliente', { type: () => ClienteInput }) cliente: ClienteInput,
  ): Promise<string> {
    return this.clienteService.createCliente(cliente);
  }

  @Mutation(() => Boolean, {
    name: 'borrar_Cliente',
    description:
      'Esta Función elimina un cliente de la base de datos y retorna un booleano indicando si se eliminó correctamente o no',
  })
  async deleteCliente(@Args('id') id: string): Promise<boolean> {
    return this.clienteService.deleteCliente(id);
  }

  @Query(() => ClienteDto, {
    name: 'obtener_Cliente_ID',
    description:
      'Esta Función retorna la información de un cliente en base a su ID',
  })
  async getClienteById(@Args('id') id: string): Promise<ClienteDto> {
    return this.clienteService.getClienteById(id);
  }

  @Mutation(() => ClienteDto, {
    name: 'Agregar_Contrato',
    description:
      'Esta Función agrega un nuevo contrato al cliente en la base de datos y retorna el documento actualizado',
  })
  async addContrato(
    @Args('id') id: string,
    @Args('contrato', { type: () => ContratoInput }) contrato: ContratoInput,
  ): Promise<ClienteDto> {
    return this.clienteService.addContrato(id, contrato);
  }

  @Query(() => [ClienteDto], {
    name: 'obtener_Todos_Clientes',
    description:
      'Esta Función retorna la información de todos los clientes en la base de datos',
  })
  async getAllClientes(): Promise<ClienteDto[]> {
    return this.clienteService.getAllClientes();
  }

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
}
