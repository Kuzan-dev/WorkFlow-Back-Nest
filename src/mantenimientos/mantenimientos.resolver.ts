import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { MantenimientosService } from './mantenimientos.service';
import { PrograMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { UpdateOneMantenimientoDto } from './dto/update-one-mantenimiento.dto';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

@Resolver()
export class MantenimientosResolver {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  //Tenico Funciones
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => String)
  hello() {
    return 'Hello world!';
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean)
  async programarMant(
    @Args('programarMantInput') prograMantDto: PrograMantenimientoDto,
  ) {
    await this.mantenimientosService.programar(prograMantDto);
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean, {
    description:
      'Esta funcion registra un mantenimiento que no haya sido previamente programado, ademas en el apartado de repuestos, solo pide entregar una id y la calidad',
  })
  async updateOneMantenimiento(
    @Args('updateOneMantenimientoInput')
    updateOneMantenimientoDto: UpdateOneMantenimientoDto,
  ) {
    await this.mantenimientosService.registrarNuevo(updateOneMantenimientoDto);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean)
  async registrarMant(
    @Args('registrarMantInput') registrarMantDto: UpdateMantenimientoDto,
  ) {
    await this.mantenimientosService.registrarPrueba(registrarMantDto);
    return true;
  }
}
