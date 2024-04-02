import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProveedorDto } from './create-proveedor.dto';

@ObjectType()
export class ProveedorResult {
  @Field(() => [ProveedorDto])
  proveedor: ProveedorDto[];

  @Field(() => Int)
  totalPages: number;
}
