import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ClienteDto } from './cliente.dto';
@ObjectType()
export class ClientesResult {
  @Field(() => [ClienteDto])
  clientes: ClienteDto[];

  @Field(() => Int)
  totalPages: number;
}
