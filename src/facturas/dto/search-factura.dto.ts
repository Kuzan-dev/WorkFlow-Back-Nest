import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FacturaDto {
  @Field()
  numeroFactura: string;

  @Field()
  monto: number;

  @Field({ nullable: true })
  igv?: number;

  @Field({ nullable: true })
  detraccion?: number;

  @Field()
  tipo: string;

  @Field()
  notificacion: boolean;

  @Field()
  fecha: Date;

  @Field({ nullable: true })
  involucrado?: string;

  @Field(() => [String], { nullable: true })
  documentos?: Array<string>;
}

@ObjectType()
export class FacturasResult {
  @Field(() => [FacturaDto])
  facturas: FacturaDto[];

  @Field(() => Int)
  totalPages: number;
}
