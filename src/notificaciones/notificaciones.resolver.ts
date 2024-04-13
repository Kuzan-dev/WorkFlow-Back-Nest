import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionDTO, CreateNotiDTO } from './dto/notificacion.dto';
import { pubSub } from 'src/shared/pubsub';
//Importaciones de Seguridad
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

@Resolver()
export class NotificacionesResolver {
  constructor(private notificacionesService: NotificacionesService) {}

  @Subscription(() => NotificacionDTO, {
    name: 'notificaciones_admin',
    description:
      'Esta Función retorna la información de las notificaciones admin',
    resolve: (payload) => payload || new NotificacionDTO(),
  })
  async mantenimientos() {
    return pubSub.asyncIterator('admin');
  }

  @Subscription(() => NotificacionDTO, {
    name: 'notificaciones_tecnico',
    description:
      'Esta Función retorna la información de las notificaciones tecnico',
    resolve: (payload) => payload || new NotificacionDTO(),
  })
  async mantenimientostec() {
    return pubSub.asyncIterator('tecnico');
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  //Agregar Query para ver todos los mensajes
  @Mutation(() => Boolean, {
    name: 'prueba_notificacion',
    description: 'Esta Función es para probar las notifaciones',
  })
  async pruebaNotificacion(
    @Args('inputNotification') inputNotification: CreateNotiDTO,
  ): Promise<boolean> {
    const { canal, tipo, identificador, titulo, descripcion, fecha, leido } =
      inputNotification;
    await this.notificacionesService.crearNotificacion(
      canal,
      tipo,
      identificador,
      titulo,
      descripcion,
      fecha,
      leido,
    );
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  //Agregar Query para ver todos los mensajes
  @Mutation(() => Boolean, {
    name: 'emergencia_notificacion',
    description: 'envia un string de notificación de emergencia',
  })
  async emergenciaNotificacion(
    @Args('emergencia') emergencia: string,
  ): Promise<boolean> {
    const { canal, tipo, identificador, titulo, descripcion, fecha, leido } = {
      canal: 'admin',
      tipo: 'mantenimiento',
      identificador: '999',
      titulo: 'Alerta - Emergencia',
      descripcion: emergencia,
      fecha: new Date(),
      leido: false,
    };
    await this.notificacionesService.crearNotificacion(
      canal,
      tipo,
      identificador,
      titulo,
      descripcion,
      fecha,
      leido,
    );
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Query(() => [NotificacionDTO], {
    name: 'obtener_notificaciones_no_leidas',
    description:
      'Esta Función retorna la información de las notificaciones no leidas',
  })
  async obtenerNotificacionesNoLeidas(): Promise<NotificacionDTO[]> {
    return this.notificacionesService.obtenerNotificacionesNoLeidas();
  }
}
