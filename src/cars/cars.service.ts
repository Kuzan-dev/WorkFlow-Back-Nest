import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { ExistsCarDto } from './dto/exists-card.dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) {}
  // Esta funcion crea un carro en la base de datos
  async create(createCarDto: CreateCarDto): Promise<Car> {
    const createCar = await this.carModel.create(createCarDto);
    return createCar;
  }
  // Esta funcion verifica si un carro existe en la base de datos
  async exists(existsCarDto: ExistsCarDto): Promise<boolean> {
    const ecar = await this.carModel.findOne({ placa: existsCarDto.placa });
    return !!ecar;
  }
}
