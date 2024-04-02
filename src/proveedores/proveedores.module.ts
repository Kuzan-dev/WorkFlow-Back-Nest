import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresResolver } from './proveedores.resolver';
import { Proveedor, ProveedorSchema } from './schemas/proveedor.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proveedor.name, schema: ProveedorSchema },
    ]),
  ],
  providers: [ProveedoresService, ProveedoresResolver],
})
export class ProveedoresModule {}
