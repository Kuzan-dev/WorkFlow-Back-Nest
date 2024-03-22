import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

//Importaciones de Seguridad
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';

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
}
