import { Module } from '@nestjs/common';
import { NotificacionesResolver } from './notificaciones.resolver';
import { NotificacionesService } from './notificaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notificacion,
  NotificacionSchema,
} from './schemas/notificacion.schema';
import { OneSignalModule } from 'onesignal-api-client-nest';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OneSignalModule.forRoot({
      // EspejoKeys
      // appId: '53544c67-6fbf-4324-bd8a-4f66224c9f22',
      // restApiKey: 'ZDBhYjUwMDYtMDU2ZC00NGE0LWEzOGQtNzE0MDYwMmI0ZWY2',
      appId: '380c1226-a0dc-4f17-b4b6-c51ed58689e1',
      restApiKey: 'Mzc0MGU2NTctNWQ5Yi00ZGI3LThjZWItNDlhYWIxNDUyZTli',
    }),
    MongooseModule.forFeature([
      { name: Notificacion.name, schema: NotificacionSchema },
    ]),
  ],
  providers: [NotificacionesResolver, NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
