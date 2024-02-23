import { Module } from '@nestjs/common';
import { RepuestosService } from './repuestos.service';
import { RepuestosResolver } from './repuestos.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Repuesto, RepuestoSchema } from './schemas/repuesto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Repuesto.name, schema: RepuestoSchema },
    ]),
  ],
  providers: [RepuestosService, RepuestosResolver],
  exports: [RepuestosService],
})
export class RepuestosModule {}
