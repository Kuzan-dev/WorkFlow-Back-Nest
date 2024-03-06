import { Module } from '@nestjs/common';
import { MantenimientosResolver } from './mantenimientos.resolver';
import { MantenimientosService } from './mantenimientos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RepuestosModule } from 'src/repuestos/repuestos.module';
import {
  Mantenimiento,
  MantenimientoSchema,
} from './schemas/mantenimiento.schema';
import { CarsModule } from 'src/cars/cars.module';
import { AuthModule } from 'src/auth/auth.module';
import { MantenimientosController } from './mantenimientos.controller';

@Module({
  imports: [
    AuthModule,

    MongooseModule.forFeature([
      { name: Mantenimiento.name, schema: MantenimientoSchema },
    ]),
    CarsModule,
    RepuestosModule,
  ],
  providers: [MantenimientosResolver, MantenimientosService],
  exports: [MantenimientosService],
  controllers: [MantenimientosController],
})
export class MantenimientosModule {}
