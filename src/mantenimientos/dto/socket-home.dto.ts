import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RepuestoDTO {
  @Field(() => ID, { name: 'id', nullable: true })
  _id: string;

  @Field({ nullable: true })
  producto: string;

  @Field({ nullable: true })
  marca: string;

  @Field({ nullable: true })
  cantidad: number;

  @Field({ nullable: true })
  cantidadReserva: number;

  @Field({ nullable: true })
  precio: number;
}

@ObjectType()
export class homeMantDTO {
  @Field(() => [Number], { nullable: true })
  calendar: number[];

  @Field(() => ID, { nullable: true })
  _id: string;

  @Field({ nullable: true })
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

  @Field(() => [RepuestoDTO], { nullable: 'itemsAndList' })
  repuestos: RepuestoDTO[];

  @Field(() => [RepuestoDTO], { nullable: 'itemsAndList' })
  repuestosAjuste: RepuestoDTO[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  documentos: Array<string>;
}

@ObjectType()
export class MaintenanceCountDto {
  @Field(() => String, { nullable: true })
  dayMes: string;

  @Field(() => Number, { nullable: true })
  cantidad: number;
}

@ObjectType()
export class CalendarAndMantenimientosDTO {
  @Field(() => [MaintenanceCountDto], { nullable: 'itemsAndList' })
  calendar: MaintenanceCountDto[];

  @Field(() => [homeMantDTO], { nullable: 'itemsAndList' })
  mantenimientos: homeMantDTO[];
}
