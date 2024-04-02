import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProveedoresService } from './proveedores.service';
import { ProveedorInput } from './dto/create-proveedor.dto';
import { ProveedorResult } from './dto/search-proveedor.dto';

@Resolver()
export class ProveedoresResolver {
  constructor(private proveedoresService: ProveedoresService) {}

  @Mutation(() => String, {
    name: 'crear_Proveedor',
    description:
      'Esta Función registra un nuevo proveedor en la base de datos y retorna el id del documento creado',
  })
  async createProveedor(@Args('input') input: ProveedorInput): Promise<string> {
    await this.proveedoresService.createProveedor(input);
    return 'Proveedor creado';
  }

  @Query(() => ProveedorResult, {
    name: 'buscar_Proveedor',
    description:
      'Esta función retorna la información del proveedor en base a su nombre',
  })
  async searchPersonal(
    @Args('nombre') nombre: string,
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ): Promise<ProveedorResult> {
    return this.proveedoresService.searchProveedor(nombre, page);
  }

  @Mutation(() => Boolean, {
    name: 'borrar_Proveedor',
    description:
      'Esta Función elimina un proveedor de la base de datos y retorna un booleano indicando si se eliminó correctamente o no',
  })
  async deletePersonal(@Args('id') id: string): Promise<boolean> {
    return this.proveedoresService.deleteProveedor(id);
  }
}
