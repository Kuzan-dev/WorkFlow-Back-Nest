import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresResolver } from './proveedores.resolver';

@Module({
  providers: [ProveedoresService, ProveedoresResolver],
})
export class ProveedoresModule {}
