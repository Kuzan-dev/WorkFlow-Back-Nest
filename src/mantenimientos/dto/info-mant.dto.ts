import { Field, ObjectType } from '@nestjs/graphql';
import { RepuestoType } from '../../repuestos/dto/repuesto.dto';

@ObjectType()
export class MantenimientoInfoDto {
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

  @Field({ nullable: true })
  cambiosSolicitados: string;

  @Field(() => [RepuestoType], { nullable: true })
  repuestos: RepuestoType[];

  @Field(() => [RepuestoType], { nullable: true })
  repuestosAjuste: RepuestoType[];

  @Field(() => [String], { nullable: true })
  documentos: Array<string>;
}

@ObjectType()
export class MantenimientoInfoDto56 {
  @Field()
  _id: string;

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
  cambiosSolicitados: string;

  @Field({ nullable: true })
  diagnostico: string;

  @Field({ nullable: true })
  diagnosticoFinal: string;

  @Field(() => [RepuestoType], { nullable: true })
  repuestos: RepuestoType[];

  @Field(() => [RepuestoType], { nullable: true })
  repuestosAjuste: RepuestoType[];

  @Field(() => [String], { nullable: true })
  documentos: Array<string>;
}
