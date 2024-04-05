import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { ExistsCarDto } from './dto/exists-card.dto';
import { UpdateKmDto } from './dto/update-km.dto';
import { SearchPlacas } from './dto/search-cars.dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) {}
  // Esta funcion crea un carro en la base de datos
  async create(createCarDto: CreateCarDto): Promise<string> {
    // Crea un nuevo objeto con todas las propiedades del DTO más kmActual
    const carData = {
      ...createCarDto,
      kmActual: createCarDto.kmRegistroInicial,
    };

    const createCar = await this.carModel.create(carData);
    return createCar.id.toString();
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
    Pick<
      Car,
      '_id' | 'placa' | 'cliente' | 'tipoContrato' | 'propietario' | 'fechaSoat'
    >[]
  > {
    return this.carModel
      .find()
      .select('_id placa cliente tipoContrato propietario fechaSoat')
      .exec();
  }

  // Esta función retorna la información de un carro por su placa
  async getCarInfo(placa: string): Promise<Car> {
    return this.carModel.findOne({ placa }).exec();
  }
  //Función de busqueda de una placa en especifico usando SearchParams
  async searchCars(placa: string): Promise<string[]> {
    if (placa === '') {
      return this.carModel.find().distinct('placa').exec();
    } else {
      return this.carModel
        .find({ placa: new RegExp(placa, 'i') })
        .distinct('placa')
        .exec();
    }
  }

  async getPuntaje(placa: string): Promise<number> {
    try {
      const car = await this.carModel.findOne({ placa }).exec();
      return car.puntaje;
    } catch (error) {
      return 0;
    }
  }

  //Función para encontrar las placas de los carros de un cliente
  async findPlatesByClient(clientName: string): Promise<string[]> {
    let cars;
    if (clientName === 'EspejoAlban') {
      cars = await this.carModel.find().exec(); // No se aplica el filtro de cliente
    } else {
      cars = await this.carModel.find({ cliente: clientName }).exec();
    }
    return cars.map((car) => car.placa);
  }

  //Función para encontrar las placas de los carros de un cliente
  async findCarByClient(clientName: string): Promise<Car[]> {
    const cars = await this.carModel.find({ cliente: clientName }).exec();
    return cars;
  }
  //Función de busqueda de una placa en especifico usando SearchParams y devuelve el primer resultado
  async findFirstByPlaca(placa: string): Promise<Car> {
    if (placa === '') {
      return this.carModel.findOne().exec();
    } else {
      return this.carModel
        .findOne({ placa: { $regex: new RegExp(placa, 'i') } })
        .exec();
    }
  }

  async getCliente(placa: string): Promise<string> {
    const car = await this.carModel.findOne({ placa }).exec();
    console.log('Car:', car);
    return car ? car.cliente : null;
  }

  //Función para encontrar las placas de los carros de un cliente
  async findCarByPlateWithPaginationAndTotalPages(
    pageSize: number,
    plate: string,
    page?: number,
  ): Promise<SearchPlacas> {
    let skip;
    let needPagination = true;
    if (page === undefined || page === null) {
      needPagination = false;
    } else {
      skip = page && page > 0 ? (page - 1) * pageSize : 0;
    }
    const query = plate === '' ? {} : { placa: new RegExp(plate, 'i') };

    const totalDocuments = await this.carModel.countDocuments(query);
    const totalPages = needPagination
      ? Math.ceil(totalDocuments / pageSize)
      : 1;
    let findQuery = this.carModel.find(query);

    if (needPagination) {
      findQuery = findQuery.skip(skip).limit(pageSize);
    }
    const cars = await findQuery.exec();

    return {
      cars,
      totalPages,
    };
  }
}
