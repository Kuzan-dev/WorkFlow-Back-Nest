import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { GetPlacasDto } from './dto/get-placas-info.dto';

@Resolver()
export class CarsResolver {
  constructor(private readonly carsService: CarsService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => String, {
    name: 'crear_auto',
    description: 'Esta Función registra un auto en la base de datos',
  })
  async createCar(@Args('createCarInput') createCarDto: CreateCarDto) {
    return await this.carsService.create(createCarDto);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [GetPlacasDto], {
    name: 'obtener_info_placas',
    description:
      'Esta Función retorna la información de los carros (id, placa, cliente, propietarios fechaSoat)',
  })
  async getCarsData() {
    return this.carsService.getCarsData();
  }
}
