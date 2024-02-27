import { Module } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { FacturasResolver } from './facturas.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Factura, FacturaSchema } from './schemas/factura.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Factura.name, schema: FacturaSchema }]),
  ],
  controllers: [FacturasController],
  providers: [FacturasService, FacturasResolver],
})
export class FacturasModule {}
