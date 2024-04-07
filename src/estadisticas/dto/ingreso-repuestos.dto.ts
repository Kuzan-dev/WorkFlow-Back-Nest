import { InputType, Field } from '@nestjs/graphql';
import { UpdateRepuestoDto } from './actualizar-repuesto.dto';
import { NuevoRepuestoDto } from './nuevo-repuesto.dto';

@InputType()
export class IngresoRepuestosDto {
  @Field(() => [UpdateRepuestoDto], { nullable: true })
  repuestosActualizar?: UpdateRepuestoDto[];

  @Field(() => [NuevoRepuestoDto], { nullable: true })
  repuestosNuevos?: NuevoRepuestoDto[];
}
