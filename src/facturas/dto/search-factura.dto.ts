import { ObjectType, Field } from '@nestjs/graphql';

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
