import { InputType, Field } from '@nestjs/graphql';
import { PersonalInput } from './create-personal.input';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@InputType()
export class PersonalUserInput {
  @Field(() => PersonalInput)
  personal: PersonalInput;

  @Field(() => CreateUserDto, { nullable: true })
  user: CreateUserDto;
}
