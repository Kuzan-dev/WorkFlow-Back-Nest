import { InputType, Field } from '@nestjs/graphql';
import {
  UpdateRepuestoDto,
  UpdateRepuestoStringDto,
} from './actualizar-repuesto.dto';
import { NuevoRepuestoDto, NuevoRepuestoStringDto } from './nuevo-repuesto.dto';

@InputType()
export class IngresoRepuestosDto {
  @Field(() => [UpdateRepuestoDto], { nullable: true })
  repuestosActualizar?: UpdateRepuestoDto[];

  @Field(() => [NuevoRepuestoDto], { nullable: true })
  repuestosNuevos?: NuevoRepuestoDto[];
}

@InputType()
export class IngresoRepuestosStringDto {
  @Field(() => [UpdateRepuestoStringDto], { nullable: true })
  repuestosActualizar?: UpdateRepuestoStringDto[];

  @Field(() => [NuevoRepuestoStringDto], { nullable: true })
  repuestosNuevos?: NuevoRepuestoStringDto[];
}
