import { Module } from '@nestjs/common';
import { CarsResolver } from './cars.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsService } from './cars.service';
import { Car, CarSchema } from './schemas/car.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }])],
  providers: [CarsResolver, CarsService],
  exports: [CarsService],
})
export class CarsModule {}
