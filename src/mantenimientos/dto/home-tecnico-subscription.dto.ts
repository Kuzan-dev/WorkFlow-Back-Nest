import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MantenimientoInfoDto } from './info-mant.dto';

@ObjectType()
export class MantenimientoResult {
  @Field(() => Int)
  cantidad: number;

  @Field(() => [MantenimientoInfoDto])
  mantenimientos: MantenimientoInfoDto[];
}
