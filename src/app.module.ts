import { config } from 'dotenv';
config();
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MantenimientosModule } from './mantenimientos/mantenimientos.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { CarsModule } from './cars/cars.module';
import { RepuestosModule } from './repuestos/repuestos.module';
import { FacturasModule } from './facturas/facturas.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { PersonalModule } from './personal/personal.module';
import { ClientesModule } from './clientes/clientes.module';
import { DocumentosModule } from './documentos/documentos.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigService available application-wide
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    AuthModule,
    UsersModule,
    MantenimientosModule,
    CarsModule,
    RepuestosModule,
    FacturasModule,
    ProveedoresModule,
    PersonalModule,
    ClientesModule,
    DocumentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
