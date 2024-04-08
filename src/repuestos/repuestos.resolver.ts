/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mutation, Resolver, Args, Query, Int } from '@nestjs/graphql';
import { RepuestosService } from './repuestos.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { VerifyRepuestoDto } from './dto/verify-repuesto.dto';
import { RepuestoDto, RepuestoType } from './dto/repuesto.dto';
import { RepuestoSearchType } from './dto/search-repuesto.dto';
import { RepuestosResult } from './dto/search-table-repuesto.dto';
import { IngresoRepuestosStringDto } from 'src/estadisticas/dto/ingreso-repuestos.dto';

//Importaciones de seguridad
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

@Resolver()
export class RepuestosResolver {
  constructor(private readonly repuestoService: RepuestosService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
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

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  // @UseGuards(GqlJwtAuthGuard, RolesGuard)
  // @Roles('admin', 'tecnico')
  @Query(() => RepuestosResult, {
    name: 'buscar_repuestos',
    description:
      'Esta función retorna la información de los repuestos que coincidan con el producto',
  })
  async searchRepuesto(
    @Args('producto') producto: string,
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ): Promise<RepuestosResult> {
    return this.repuestoService.searchRepuesto(producto, page);
  }

  @Mutation(() => String, {
    name: 'Ingreso_Repuestos_Web',
    description: 'Función para ingresar repuestos desde la web',
  })
  async ingresarRepuestos(@Args('data') data: IngresoRepuestosStringDto) {
    const dataNumerica = {
      repuestosActualizar: data.repuestosActualizar?.map((repuesto) => ({
        ...repuesto,
        cantidad: Number(repuesto.cantidad),
        precio: Number(repuesto.precio),
      })),
      repuestosNuevos: data.repuestosNuevos?.map((repuesto) => ({
        ...repuesto,
        cantidad: Number(repuesto.cantidad),
        precio: Number(repuesto.precio),
      })),
    };
    await this.repuestoService.ingresarRepuestos(dataNumerica);
    return 'Repuestos ingresados correctamente';
  }
}
