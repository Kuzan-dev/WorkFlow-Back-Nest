import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

//Importaciones de Seguridad
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { UserOutput } from 'src/users/dto/create-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => Boolean)
  async createUser(@Args('username') user: CreateUserDto) {
    await this.usersService.create(user);
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => Boolean, {
    name: 'crear_multiples_users',
    description: 'Esta Función crea multiples usuarios en la base de datos',
  })
  async createUsers(
    @Args({ name: 'users', type: () => [CreateUserDto] })
    users: CreateUserDto[],
  ) {
    if (!users) {
      return true;
    }
    await Promise.all(users.map((user) => this.usersService.create(user)));
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => Boolean)
  async updatePassword(
    @Args('username') username: string,
    @Args('newPassword') newPassword: string,
  ) {
    await this.usersService.updatePassword(username, newPassword);
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico', 'cliente')
  @Mutation(() => String, {
    name: 'actualizar_datos_usuario_por_id',
    description:
      'Esta Función actualiza la información de un usuario en la base de datos',
  })
  async updateUser(
    @Args('_id') _id: string,
    @Args('newUsername', { nullable: true }) newUsername: string,
    @Args('newPassword', { nullable: true }) newPassword: string,
  ): Promise<string> {
    try {
      await this.usersService.updateDataUser(_id, newUsername, newPassword);
      return 'operación exitosa';
    } catch (error) {
      return 'fallo la operación';
    }
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => String, {
    name: 'borrar_usuario_por_id',
    description: 'Esta Función elimina un usuario de la base de datos',
  })
  async deleteUser(@Args('_id') _id: string): Promise<string> {
    try {
      await this.usersService.deleteUser(_id);
      return 'Usuario eliminado correctamente';
    } catch (error) {
      return 'Fallo al eliminar user';
    }
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico', 'cliente')
  @Query(() => UserOutput, {
    name: 'obtener_usuario_por_username',
    description: 'Esta Función obtiene un usuario por su username',
  })
  async getUsersByClienteName(
    @Args('username') username: string,
  ): Promise<UserOutput> {
    return this.usersService.findOne(username);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico', 'cliente')
  @Mutation(() => Boolean, {
    name: 'actualizar_datos_usuario',
    description: 'Esta Función actualiza la información de un usuario',
  })
  async updateData(
    @Args('oldUsername') oldUsername: string,
    @Args('newName') newName: string,
    @Args('newEmail') newEmail: string,
    @Args('newPassword') newPassword: string,
    @Args('newUsername', { nullable: true }) newUsername?: string,
  ) {
    await this.usersService.updateDatUser(
      oldUsername,
      newUsername,
      newName,
      newEmail,
      newPassword,
    );
    return true;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Query(() => UserOutput, {
    name: 'obtener_usuario_por_id',
    description: 'Esta Función obtiene un usuario por su id',
  })
  async getUserById(@Args('_id') _id: string): Promise<UserOutput> {
    return this.usersService.findOneID(_id);
  }
}
