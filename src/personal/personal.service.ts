import { Injectable } from '@nestjs/common';
import { Personal, PersonalDocument } from './schemas/personal.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PersonalDto, SalarioFechaDto } from './dto/create-personal.dto';

@Injectable()
export class PersonalService {
  constructor(
    @InjectModel(Personal.name) private personalModel: Model<PersonalDocument>,
  ) {}

  async createPersonal(createPersonalDto: PersonalDto): Promise<string> {
    const createdPersonal = new this.personalModel(createPersonalDto);
    const savedPersonal = await createdPersonal.save();
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

  async getPersonalById(id: string): Promise<Personal> {
    return this.personalModel.findById(id).exec();
  }
}
