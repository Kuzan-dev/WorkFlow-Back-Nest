import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
@Resolver()
export class CarsResolver {
  constructor(private readonly carsService: CarsService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean)
  async createCar(@Args('createCarInput') createCarDto: CreateCarDto) {
    await this.carsService.create(createCarDto);
    return true;
  }
}
