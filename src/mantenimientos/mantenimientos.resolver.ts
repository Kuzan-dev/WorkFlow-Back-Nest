import { Resolver, Args, Mutation, Query, Subscription } from '@nestjs/graphql';
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
import { HomeAdminDTO } from './dto/home-admin.dto';
import {
  CalendarAndMantenimientosDTO,
  homeMantDTO,
} from './dto/socket-home.dto';
import { pubSub } from 'src/shared/pubsub';
import { MesRepuestos } from './dto/repuestos.mant-busqueda.dto';

@Resolver()
export class MantenimientosResolver {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  @Subscription(() => CalendarAndMantenimientosDTO, {
    name: 'Calendar_Hoy_Tecnico',
    description:
      'Esta funcion retorna el calendario de mantenimientos programados del mes, y ademas los mantenimientos para el dia de hoy',
    nullable: true,
    resolve: (payload) => payload.calendarTecnico,
  })
  calendarTecnico() {
    return pubSub.asyncIterator('calendarTecnico');
  }

  @Subscription(() => [homeMantDTO], {
    name: 'Actividades',
    description:
      'Esta funcion retorna los mantenimientos desde el día de hoy para la pestaña de actividades',
  })
  actividadesTec() {
    return pubSub.asyncIterator('Actividades');
  }

  @Query(() => [MesRepuestos], {
    name: 'grafica_repuesto_xmeses',
    description:
      'Esta función retorna los repuestos consumidos en los ultimos x meses, para el reporte de repuestos',
  })
  async getConsumedRepuestos(
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('months', { type: () => Number }) months: number,
  ) {
    const start = new Date(startDate);
    return this.mantenimientosService.getConsumedRepuestos(start, months);
  }

  @Query(() => [Date], {
    name: 'calendar',
    description:
      'Esta función retorna una matriz con las fechas de los mantenimientos que tengan de estado "programado"',
  })
  async getProgrammedMaintenanceDates() {
    return this.mantenimientosService.getProgrammedMaintenanceDates();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => MantenimientoInfoDto, {
    name: 'Mantenimiento_Info_por_ID',
    description:
      'Esta funcion retorna la informacion de un mantenimiento por id',
  })
  async mantenimiento(@Args('id', { type: () => String }) id: string) {
    return this.mantenimientosService.getMantenimientoPorId(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => HomeAdminDTO, {
    name: 'home_admin',
    description:
      'Esta funcion se usa en el home del admin y retorna la cantidad de mantenimientos programados, la cantidad total de mantenimientos y los mantenimientos programados',
  })
  async homeAdmin(@Args('fecha') fecha: Date): Promise<HomeAdminDTO> {
    const cantidadProgramada =
      await this.mantenimientosService.getCantidadMantenimientosPorEstadoYFecha(
        'programada',
        fecha,
      );
    const cantidadPendiente =
      await this.mantenimientosService.getCantidadMantenimientosPorEstadoYFecha(
        'pendiente',
        fecha,
      );
    const cantidadRevision =
      await this.mantenimientosService.getCantidadMantenimientosPorEstadoYFecha(
        'revision',
        fecha,
      );
    const cantidadCompletada =
      await this.mantenimientosService.getCantidadMantenimientosPorEstadoYFecha(
        'completado',
        fecha,
      );

    const cantidadTotal =
      cantidadCompletada + cantidadPendiente + cantidadRevision;

    const mantenimientos1 =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        'programado',
        fecha,
      );
    const mantenimientos2 =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        'pendiente',
        fecha,
      );
    const mantenimientos3 =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        'revision',
        fecha,
      );
    const mantenimientos4 =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        'completado',
        fecha,
      );
    const mantenimientos5 =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        'aprobado',
        fecha,
      );
    const mantenimientos6 =
      await this.mantenimientosService.getMantenimientosPorEstadoYFecha(
        'expirado',
        fecha,
      );

    const mantenimientos = [
      ...mantenimientos1,
      ...mantenimientos2,
      ...mantenimientos3,
      ...mantenimientos4,
      ...mantenimientos5,
      ...mantenimientos6,
    ];

    return {
      cantidadProgramada,
      cantidadTotal,
      mantenimientos,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(() => CarInfo, {
    name: 'admin_history_cars',
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

  @Mutation(() => Boolean, {
    name: 'cambiar_estado_revision',
    description:
      'Esta función cambia el estado de un mantenimiento a "revision" y realiza una corrección de repuestos, esta corrección es quitar los repuestos que estaban reservados',
  })
  async revision(
    @Args('id', { type: () => String }) id: string,
    @Args('cambiosSolicitados', { type: () => String })
    cambiosSolicitados: string,
  ) {
    await this.mantenimientosService.revision(id, cambiosSolicitados);
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => String, {
    name: 'programar_mantenimiento',
    description: 'Esta funcion programa un mantenimiento',
  })
  async programarMant(
    @Args('programarMantInput') prograMantDto: PrograMantenimientoDto,
  ) {
    return await this.mantenimientosService.programar(prograMantDto);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => String, {
    name: 'regisrar_mantenimiento_no_programado',
    description:
      'Esta funcion registra un mantenimiento que no haya sido previamente programado, ademas en el apartado de repuestos, solo pide entregar una id y la cantidad',
  })
  async updateOneMantenimiento(
    @Args('updateOneMantenimientoInput')
    updateOneMantenimientoDto: UpdateOneMantenimientoDto,
  ) {
    return await this.mantenimientosService.registrarNuevo(
      updateOneMantenimientoDto,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => String, {
    name: 'regisrar_mantenimiento_programado',
    description:
      'Esta Función registra un mantenimiento que ya haya sido previamente programado, ademas en el apartado de repuestos, pide entregar una id y la cantidad',
  })
  async registrarMant(
    @Args('registrarMantInput') registrarMantDto: UpdateMantenimientoDto,
  ) {
    return await this.mantenimientosService.registrar(registrarMantDto);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => String, {
    name: 'completar_mantenimiento',
    description:
      'Esta función actualiza el campo diagnosticoFinal de un mantenimiento y cambia su estado a "completado"',
  })
  async actualizarDiagnosticoFinal(
    @Args('id', { type: () => String }) id: string,
    @Args('diagnosticoFinal', { type: () => String }) diagnosticoFinal: string,
  ): Promise<string> {
    return await this.mantenimientosService.completarMantenimiento(
      id,
      diagnosticoFinal,
    );
  }
}
