import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { MantenimientosService } from './mantenimientos.service';
import { PrograMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { UpdateOneMantenimientoDto } from './dto/update-one-mantenimiento.dto';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { ExistsCarDto } from 'src/cars/dto/exists-card.dto';
import { CarInfo } from './dto/info-placa-mant.dto';
import { MantenimientoInfoDto } from './dto/info-mant.dto';
import { MantenimientoResult } from './dto/home-tecnico-subscription.dto';

@Resolver()
export class MantenimientosResolver {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  //Tenico Funciones
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => MantenimientoInfoDto, {
    description:
      'Esta funcion retorna la informacion de un mantenimiento por id',
  })
  async mantenimiento(@Args('id', { type: () => String }) id: string) {
    return this.mantenimientosService.getMantenimientoPorId(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(() => CarInfo, {
    description:
      'Esta Función retorna la información de un auto ademas de sus mantenimientos (id, fecha, tipo, repuestosUsados) por medio de su placa',
  })
  async findInfoForPlaca(
    @Args('placa', { type: () => String }) placa: string,
  ): Promise<CarInfo> {
    const existsCarDto: ExistsCarDto = { placa };
    return this.mantenimientosService.findInfoForPlaca(existsCarDto);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => MantenimientoResult, {
    description:
      'Esta funcion retorna la cantidad de mantenimientos por estado y los mantenimientos (información compleja) por estado y fecha',
  })
  async mantenimientoChanges(
    @Args('estado') estado: string,
    @Args('fecha') fecha: Date,
  ) {
    const cantidad =
      await this.mantenimientosService.getCantidadMantenimientosPorEstado(
        estado,
      );
    const mantenimientos =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        estado,
        fecha,
      );
    return { cantidad, mantenimientos };
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean, {
    description: 'Esta funcion programa un mantenimiento',
  })
  async programarMant(
    @Args('programarMantInput') prograMantDto: PrograMantenimientoDto,
  ) {
    await this.mantenimientosService.programar(prograMantDto);
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean, {
    description:
      'Esta funcion registra un mantenimiento que no haya sido previamente programado, ademas en el apartado de repuestos, solo pide entregar una id y la cantidad',
  })
  async updateOneMantenimiento(
    @Args('updateOneMantenimientoInput')
    updateOneMantenimientoDto: UpdateOneMantenimientoDto,
  ) {
    await this.mantenimientosService.registrarNuevo(updateOneMantenimientoDto);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean, {
    description:
      'Esta Función registra un mantenimiento que ya haya sido previamente programado, ademas en el apartado de repuestos, pide entregar una id y la cantidad',
  })
  async registrarMant(
    @Args('registrarMantInput') registrarMantDto: UpdateMantenimientoDto,
  ) {
    await this.mantenimientosService.registrar(registrarMantDto);
    return true;
  }
}
