/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
//Importaciones de Seguridad
import { Roles } from '../auth/roles.decorator';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { FacturasResult } from './dto/search-factura.dto';

@Resolver()
export class FacturasResolver {
  constructor(private readonly facturasService: FacturasService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Mutation((returns) => String, {
    name: 'crear_factura',
    description:
      'Esta Función registra una factura en la base de datos y retorna el id de la factura creada',
  })
  async createFactura(
    @Args('createFacturaInput') createFacturaDto: CreateFacturaDto,
  ) {
    const id = await this.facturasService.create(createFacturaDto);
    return id;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => Number, {
    name: 'Egreso_Facturas_Mensual',
    description:
      'Esta Función retorna el total de salarios de todo el personal en la base de dato',
  })
  async getEFact(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<number> {
    const date = new Date(inputDate);
    return this.facturasService.getEgresosDelMes(date);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => Number, {
    name: 'Ingreso_Facturas_Mensual',
    description:
      'Esta Función retorna el total de salarios de todo el personal en la base de dato',
  })
  async getInFact(
    @Args('inputDate', { type: () => String }) inputDate: string,
  ): Promise<number> {
    const date = new Date(inputDate);
    return this.facturasService.getIngresosDelMes(date);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => FacturasResult, {
    name: 'buscar_factura',
    description:
      'Esta Función retorna una lista de facturas que coinciden con el numero de factura',
  })
  async searchFactura(
    @Args('numeroFactura') numeroFactura: string,
    @Args('page', { type: () => Int, nullable: true }) page: number,
  ): Promise<FacturasResult> {
    const facturas = await this.facturasService.searchFactura(
      numeroFactura,
      page,
    );
    return facturas;
  }
}
