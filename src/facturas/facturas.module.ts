import { Module } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { FacturasResolver } from './facturas.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Factura, FacturaSchema } from './schemas/factura.schema';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    NotificacionesModule,
    MongooseModule.forFeature([{ name: Factura.name, schema: FacturaSchema }]),
  ],
  controllers: [FacturasController],
  providers: [FacturasService, FacturasResolver],
  exports: [FacturasService],
})
export class FacturasModule {}
