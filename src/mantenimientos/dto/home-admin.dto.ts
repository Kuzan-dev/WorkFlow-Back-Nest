import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MantenimientoInfoDto2 } from './info-mant-home.dto';

@ObjectType()
export class HomeAdminDTO {
  @Field(() => Int)
  cantidadProgramada: number;

  @Field(() => Int)
  cantidadTotal: number;

  @Field(() => [MantenimientoInfoDto2])
  mantenimientos: MantenimientoInfoDto2[];
}
