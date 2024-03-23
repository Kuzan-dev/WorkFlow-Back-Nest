import { InputType, Field } from '@nestjs/graphql';
import { ClienteInput } from './cliente.input';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@InputType()
export class ClienteUserInput {
  @Field(() => ClienteInput)
  cliente: ClienteInput;

  @Field(() => [CreateUserDto], { nullable: true })
  users: CreateUserDto[];
}
