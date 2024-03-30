import { ObjectType, Field } from '@nestjs/graphql';
import { RepuestoConsumido } from './costo-repuesto.dto';

@ObjectType()
export class RepuestosMasConsumidosPorMes {
  @Field({ nullable: true })
  mes: string;
  @Field(() => RepuestoConsumido, { nullable: true })
  repuesto1: RepuestoConsumido;

  @Field(() => RepuestoConsumido, { nullable: true })
  repuesto2: RepuestoConsumido;

  @Field(() => RepuestoConsumido, { nullable: true })
  repuesto3: RepuestoConsumido;

  @Field(() => RepuestoConsumido, { nullable: true })
  repuesto4: RepuestoConsumido;

  @Field({ nullable: true })
  otros: number;
}
