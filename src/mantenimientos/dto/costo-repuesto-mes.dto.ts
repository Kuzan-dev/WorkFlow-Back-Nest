import { ObjectType, Field } from '@nestjs/graphql';
import { RepuestoConsumido } from './costo-repuesto.dto';

@ObjectType()
export class RepuestosMasConsumidosPorMes {
  @Field({ nullable: true })
  mes: string;
  @Field(() => RepuestoConsumido)
  repuesto1: RepuestoConsumido;

  @Field(() => RepuestoConsumido)
  repuesto2: RepuestoConsumido;

  @Field(() => RepuestoConsumido)
  repuesto3: RepuestoConsumido;

  @Field(() => RepuestoConsumido)
  repuesto4: RepuestoConsumido;

  @Field({ nullable: true })
  otros: number;
}
