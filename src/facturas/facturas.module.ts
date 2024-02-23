import { Module } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { FacturasResolver } from './facturas.resolver';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService, FacturasResolver],
})
export class FacturasModule {}
