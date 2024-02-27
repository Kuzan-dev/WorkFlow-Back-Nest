import { Module } from '@nestjs/common';
import { ClientesResolver } from './clientes.resolver';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';

@Module({
  providers: [ClientesResolver, ClientesService],
  controllers: [ClientesController],
})
export class ClientesModule {}
