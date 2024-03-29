import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RepuestoSearchType } from './search-repuesto.dto';

@ObjectType()
export class RepuestosResult {
  @Field(() => [RepuestoSearchType])
  repuestos: RepuestoSearchType[];

  @Field(() => Int)
  totalPages: number;
}
