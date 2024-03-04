import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Mantenimiento,
  MantenimientoSchema,
} from '../mantenimientos/schemas/mantenimiento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mantenimiento.name, schema: MantenimientoSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [TasksService],
})
export class TasksModule {}
