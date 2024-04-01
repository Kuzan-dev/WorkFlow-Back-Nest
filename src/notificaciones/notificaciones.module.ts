import { Module } from '@nestjs/common';
import { NotificacionesResolver } from './notificaciones.resolver';
import { NotificacionesService } from './notificaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notificacion,
  NotificacionSchema,
} from './schemas/notificacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notificacion.name, schema: NotificacionSchema },
    ]),
  ],
  providers: [NotificacionesResolver, NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
