import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasResolver } from './estadisticas.resolver';
import { CarsModule } from 'src/cars/cars.module';
import { RepuestosModule } from 'src/repuestos/repuestos.module';
import { MantenimientosModule } from 'src/mantenimientos/mantenimientos.module';
import { PersonalModule } from 'src/personal/personal.module';
import { FacturasModule } from 'src/facturas/facturas.module';

@Module({
  imports: [
    CarsModule,
    RepuestosModule,
    MantenimientosModule,
    PersonalModule,
    FacturasModule,
  ],
  providers: [EstadisticasService, EstadisticasResolver],
})
export class EstadisticasModule {}
