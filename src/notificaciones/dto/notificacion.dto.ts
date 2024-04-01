import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class NotificacionDTO {
  @Field()
  _id: string;

  @Field()
  tipo: string;

  @Field()
  titulo: string;

  @Field()
  identificador: string;

  @Field()
  descripcion: string;

  @Field()
  fecha: Date;

  @Field()
  leido: boolean;
}

@InputType()
export class CreateNotiDTO {
  @Field()
  canal: string;

  @Field()
  tipo: string;

  @Field()
  titulo: string;

  @Field()
  identificador: string;

  @Field()
  descripcion: string;

  @Field()
  fecha: Date;

  @Field()
  leido: boolean;
}
