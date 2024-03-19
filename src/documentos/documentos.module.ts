import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { Cliente, ClienteSchema } from '../clientes/schemas/cliente.schema';
import { Factura, FacturaSchema } from '../facturas/schemas/factura.schema';
import { Personal, PersonalSchema } from '../personal/schemas/personal.schema';
import {
  Mantenimiento,
  MantenimientoSchema,
} from '../mantenimientos/schemas/mantenimiento.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Cliente.name, schema: ClienteSchema },
      { name: Factura.name, schema: FacturaSchema },
      { name: Personal.name, schema: PersonalSchema },
      { name: Mantenimiento.name, schema: MantenimientoSchema },
      { name: Car.name, schema: CarSchema },
    ]),
  ],
  providers: [DocumentosService],
  controllers: [DocumentosController],
})
export class DocumentosModule {}
