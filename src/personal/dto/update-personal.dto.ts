import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePersonalInput {
  @Field({ nullable: true })
  nombre: string;

  @Field(() => Int, { nullable: true })
  numero: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  fechaIngreso: Date;
}
