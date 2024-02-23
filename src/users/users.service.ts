import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  //Inyectamos el modelo Mongoose para el esquema de usuario en el servicio de usuarios.Almacenamos este modelo en una propiedad privada llamada userModel para ser usado en los métodos del servicio.
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  //El método findOne recibe un nombre de usuario
  async findOne(username: string): Promise<UserDocument | undefined> {
    //Retorna las propiedades del usuario en caso lo encuentre
    return this.userModel.findOne({ username: username }).exec();
  }

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async updatePassword(username: string, newPassword: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return user.save();
  }
}
