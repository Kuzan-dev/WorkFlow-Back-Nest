import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { GetPlacasDto } from './dto/get-placas-info.dto';
import { GetForPlacasDto } from './dto/get-for-placa';
import { GetPlacasClientDto } from './dto/get-placas-info-client.dto';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { SearchPlacas } from './dto/search-cars.dto';

@Resolver()
export class CarsResolver {
  constructor(
    private readonly carsService: CarsService,
    private readonly usersService: UsersService,
  ) {}

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

  @Query(() => GetForPlacasDto, {
    name: 'obtener_info_for_placa',
    description:
      'Esta Función retorna la información de un auto por medio de su placa',
  })
  async getCarInfo(@Args('placa', { type: () => String }) placa: string) {
    return this.carsService.getCarInfo(placa);
  }

  @Query(() => [String], {
    name: 'buscar_placas_autos',
    description: 'Esta Función retorna las placas de los autos',
  })
  async searchCars(@Args('placa', { type: () => String }) placa: string) {
    return this.carsService.searchCars(placa);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  @Query(() => [GetPlacasClientDto], {
    name: 'obtener_info_placas_clientes',
    description:
      'Esta Función retorna la información de los carros (id, placa, cliente, propietarios fechaSoat)',
  })
  async getCarsDataClient(@Context() context) {
    const username = context.req.user.username;
    const client = await this.usersService.findClientByUsername(username);
    return this.carsService.findCarByClient(client);
  }

  @Query(() => SearchPlacas, {
    name: 'buscar_info_placas_tabla',
    description: 'Esta Función retorna las placas de los autos',
  })
  async findCarByPlateWithPaginationAndTotalPages(
    @Args('plate') plate: string,
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ) {
    return this.carsService.findCarByPlateWithPaginationAndTotalPages(
      plate,
      page,
      pageSize,
    );
  }
}
