import { InputType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { RepuestoDto } from './repuesto.dto';

@InputType()
export class VerifyRepuestoDto {
  @Field(() => [RepuestoDto], { nullable: true })
  @IsArray()
  repuestos: RepuestoDto[];
}
