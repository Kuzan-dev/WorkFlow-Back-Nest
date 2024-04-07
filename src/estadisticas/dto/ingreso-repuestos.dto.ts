import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { UpdateRepuestoDto } from './actualizar-repuesto.dto';
import { NuevoRepuestoDto } from './nuevo-repuesto.dto';

@InputType()
export class IngresoRepuestosDto {
  @Field(() => [UpdateRepuestoDto])
  @IsNotEmpty()
  repuestosActualizar: UpdateRepuestoDto[];

  @Field(() => [NuevoRepuestoDto])
  @IsNotEmpty()
  repuestosNuevos: NuevoRepuestoDto[];
}
