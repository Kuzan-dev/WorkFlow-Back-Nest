import { Injectable } from '@nestjs/common';
import { Personal, PersonalDocument } from './schemas/personal.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PersonalDto, SalarioFechaDto } from './dto/create-personal.dto';
import { pubSub } from 'src/shared/pubsub';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PersonalService {
  constructor(
    @InjectModel(Personal.name) private personalModel: Model<PersonalDocument>,
    private userService: UsersService,
  ) {}

  async createPersonal(createPersonalDto: PersonalDto): Promise<string> {
    const createdPersonal = new this.personalModel(createPersonalDto);
    const savedPersonal = await createdPersonal.save();
    const allPersonal = await this.getAllPersonal();
    pubSub.publish('Personal', { Personal: allPersonal });
    return savedPersonal._id;
  }

  async addSalarioFecha(
    id: string,
    salarioFecha: SalarioFechaDto,
  ): Promise<Personal> {
    return this.personalModel
      .findByIdAndUpdate(
        id,
        { $push: { salarioFecha: salarioFecha } },
        { new: true },
      )
      .exec();
  }

  async deletePersonal(id: string): Promise<boolean> {
    const result = await this.personalModel.findByIdAndDelete(id).exec();
    return result != null;
  }

  async getAllPersonal(): Promise<Personal[]> {
    return this.personalModel.find().exec();
  }

  async getPersonalById(id: string): Promise<PersonalDto> {
    return this.personalModel.findById(id).exec();
  }

  async getTotalSalaryForMonth(queryDateISO: string): Promise<number> {
    const queryDate = new Date(queryDateISO);
    const personals = await this.personalModel.find().exec();
    let totalSalary = 0;

    const queryMonth = queryDate.getMonth();
    const queryYear = queryDate.getFullYear();

    for (const personal of personals) {
      personal.salarioFecha.sort(
        (a, b) => b.fecha.getTime() - a.fecha.getTime(),
      );

      for (const sf of personal.salarioFecha) {
        if (
          sf.fecha.getFullYear() < queryYear ||
          (sf.fecha.getFullYear() === queryYear &&
            sf.fecha.getMonth() <= queryMonth)
        ) {
          totalSalary += sf.salario;
          break;
        }
      }
    }

    return totalSalary || 0;
  }

  async searchPersonal(
    nombre: string,
    page?: number,
  ): Promise<{ personal: Personal[]; totalPages: number }> {
    const limit = 8;
    const skip = page && page > 0 ? (page - 1) * limit : 0;

    const query = nombre === '' ? {} : { nombre: new RegExp(nombre, 'i') };

    const totalDocuments = await this.personalModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const personal = await this.personalModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      personal,
      totalPages,
    };
  }

  // Función para actualizar uno o mas parametros de personal
  async updateInfoPersonal(
    id: string,
    updatePersonalDto: Partial<Personal>,
  ): Promise<Personal> {
    return this.personalModel.findByIdAndUpdate(id, updatePersonalDto, {
      new: true,
    });
  }
}
