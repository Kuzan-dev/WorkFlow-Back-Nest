import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Mantenimiento,
  MantenimientoSchema,
} from '../mantenimientos/schemas/mantenimiento.schema';
import {
  Notificacion,
  NotificacionSchema,
} from 'src/notificaciones/schemas/notificacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mantenimiento.name, schema: MantenimientoSchema },
      { name: Notificacion.name, schema: NotificacionSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [TasksService],
})
export class TasksModule {}
