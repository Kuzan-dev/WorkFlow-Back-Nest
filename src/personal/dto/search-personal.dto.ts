import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PersonalDto } from './create-personal.dto';

@ObjectType()
export class PersonalResult {
  @Field(() => [PersonalDto])
  personal: PersonalDto[];

  @Field(() => Int)
  totalPages: number;
}
