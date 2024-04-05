import { Injectable, NotFoundException } from '@nestjs/common';
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
      clienteAsociado: user.clienteAsociado ?? 'EspejoAlban',
    });
    return newUser.save();
  }

  async updatePassword(
    oldUsername: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({ username: oldUsername }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return user.save();
  }

  async getUsersByClienteName(clienteName: string): Promise<User[]> {
    const users = await this.userModel.find({ clienteAsociado: clienteName });
    return users;
  }

  async updateDataUser(
    _id: string,
    newUsername?: string,
    newPassword?: string,
  ): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    if (newUsername) {
      user.username = newUsername;
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }
    return user.save();
  }
  async deleteUser(_id: string): Promise<string> {
    const result = await this.userModel.findByIdAndDelete(_id).exec();
    if (!result) {
      throw new Error('User not found');
    }
    return 'User deleted successfully';
  }
  // Función que buscar el clienteAsoaciado de un usuario por su username
  async findClientByUsername(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user.clienteAsociado;
  }

  async updateDatUser(
    oldUsername: string,
    newUsername: string,
    newName: string,
    newEmail: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({ username: oldUsername }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.username = newUsername;
    user.name = newName;
    user.email = newEmail;
    return user.save();
  }
}
