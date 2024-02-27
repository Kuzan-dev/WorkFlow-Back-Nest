import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { ExistsCarDto } from './dto/exists-card.dto';
import { UpdateKmDto } from './dto/update-km.dto';

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

  // Esta funcion encuentra la información de un carro por su placa
  async findCarInfo(existsCarDto: ExistsCarDto): Promise<Car> {
    return this.carModel.findOne({ placa: existsCarDto.placa }).exec();
  }

  // Esta función actualiza el kmActual de un carro
  async updateKm(updateKmDto: UpdateKmDto): Promise<Car> {
    return this.carModel
      .findOneAndUpdate(
        { placa: updateKmDto.placa }, // encuentra el carro por su placa
        { kmActual: updateKmDto.kmActual }, // actualiza el kmActual
        { new: true }, // devuelve el documento actualizado
      )
      .exec();
  }

  // Esta función retorna la información de los carros
  async getCarsData(): Promise<
    Pick<Car, '_id' | 'placa' | 'cliente' | 'fechaSoat'>[]
  > {
    return this.carModel.find().select('_id placa cliente fechaSoat').exec();
  }
}
