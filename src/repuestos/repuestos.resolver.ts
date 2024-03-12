/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { RepuestosService } from './repuestos.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { VerifyRepuestoDto } from './dto/verify-repuesto.dto';
import { RepuestoDto, RepuestoType } from './dto/repuesto.dto';
import { RepuestoSearchType } from './dto/search-repuesto.dto';

@Resolver()
export class RepuestosResolver {
  constructor(private readonly repuestoService: RepuestosService) {}

  @Query((returns) => [RepuestoType], {
    name: 'obtener_todos_los_repuestos',
    description:
      'Esta Función retorna la información de todos los repuestos (id, producto, marca, cantidad, cantidadReserva, precio)',
  })
  async findAll(): Promise<RepuestoType[]> {
    const repuestos = await this.repuestoService.findAll();
    return repuestos.map((repuesto) => ({
      id: repuesto._id,
      producto: repuesto.producto,
      marca: repuesto.marca,
      cantidad: repuesto.cantidad,
      cantidadReserva: repuesto.cantidadReserva,
      precio: repuesto.precio,
    }));
  }

  @Mutation((returns) => Boolean, {
    name: 'crear_repuesto',
    description:
      'Esta Función registra un repuesto en la base de datos y retorna true si se registro correctamente',
  })
  async createRepuesto(
    @Args('createRepuestoInput') createRepuestoDto: CreateRepuestoDto,
  ) {
    await this.repuestoService.create(createRepuestoDto);
    return true;
  }

  @Mutation((returns) => Boolean, {
    name: 'verficar_repuestos',
    description:
      'Esta Función se usa internamente para actualizar repuestos en la base de datos y retorna true si se actualizo correctamente, no usar en el cliente',
  })
  async verifyRepuesto(
    @Args('verifyRepuestoInput') verifyRepuestoDto: VerifyRepuestoDto,
  ) {
    await this.repuestoService.verify(verifyRepuestoDto);
    return true;
  }

  @Query(() => [RepuestoType], {
    name: 'buscar_repuestos',
    description: 'Esta Función r',
  })
  async searchRepuesto(
    @Args('producto') producto: string,
  ): Promise<RepuestoSearchType[]> {
    return this.repuestoService.searchRepuesto(producto);
  }
}
