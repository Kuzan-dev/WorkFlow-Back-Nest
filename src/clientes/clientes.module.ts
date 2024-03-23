import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema } from './schemas/cliente.schema';
import { ClientesResolver } from './clientes.resolver';
import { ClientesService } from './clientes.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Cliente.name, schema: ClienteSchema }]),
  ],
  providers: [ClientesResolver, ClientesService],
})
export class ClientesModule {}
