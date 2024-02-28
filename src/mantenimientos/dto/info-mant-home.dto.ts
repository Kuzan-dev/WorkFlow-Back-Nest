import { Field, ObjectType } from '@nestjs/graphql';
import { RepuestoType2 } from '../../repuestos/dto/repuesto2.dto';

@ObjectType()
export class MantenimientoInfoDto2 {
  @Field()
  placa: string;

  @Field({ nullable: true })
  tipo: string;

  @Field({ nullable: true })
  tecnico: string;

  @Field({ nullable: true })
  estado: string;

  @Field({ nullable: true })
  kmPrevio: number;

  @Field({ nullable: true })
  kmMedido: number;

  @Field({ nullable: true })
  cliente: string;

  @Field({ nullable: true })
  fecha: Date;

  @Field({ nullable: true })
  fechaInicio: Date;

  @Field({ nullable: true })
  fechaFin: Date;

  @Field({ nullable: true })
  fechaSoat: Date;

  @Field({ nullable: true })
  anotaciones: string;

  @Field({ nullable: true })
  diagnostico: string;

  @Field({ nullable: true })
  diagnosticoFinal: string;

  @Field(() => [RepuestoType2], { nullable: true })
  repuestos: RepuestoType2[];

  @Field(() => [RepuestoType2], { nullable: true })
  repuestosAjuste: RepuestoType2[];

  @Field(() => [String], { nullable: true })
  documentos: Array<string>;
}
