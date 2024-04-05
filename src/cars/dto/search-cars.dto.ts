import { ObjectType, Field } from '@nestjs/graphql';
import { GetPlacasDto } from './get-placas-info.dto';

@ObjectType()
export class SearchPlacas {
  @Field(() => [GetPlacasDto])
  cars: GetPlacasDto[];

  @Field()
  totalPages: number;
}
