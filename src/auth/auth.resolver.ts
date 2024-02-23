import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Boolean)
  async createUser(@Args('username') user: CreateUserDto) {
    await this.usersService.create(user);
    return true;
  }
  @Mutation(() => Boolean)
  async updatePassword(
    @Args('username') username: string,
    @Args('newPassword') newPassword: string,
  ) {
    await this.usersService.updatePassword(username, newPassword);
    return true;
  }
}
