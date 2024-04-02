import { Module } from '@nestjs/common';
import { NotificacionesResolver } from './notificaciones.resolver';
import { NotificacionesService } from './notificaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notificacion,
  NotificacionSchema,
} from './schemas/notificacion.schema';
import { OneSignalModule } from 'onesignal-api-client-nest';

@Module({
  imports: [
    OneSignalModule.forRoot({
      appId: '53544c67-6fbf-4324-bd8a-4f66224c9f22',
      restApiKey: 'ZDBhYjUwMDYtMDU2ZC00NGE0LWEzOGQtNzE0MDYwMmI0ZWY2',
    }),
    MongooseModule.forFeature([
      { name: Notificacion.name, schema: NotificacionSchema },
    ]),
  ],
  providers: [NotificacionesResolver, NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
