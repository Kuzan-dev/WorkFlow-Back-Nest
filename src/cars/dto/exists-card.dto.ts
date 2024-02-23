import { IsString, IsNotEmpty } from 'class-validator';

export class ExistsCarDto {
  @IsString()
  @IsNotEmpty()
  placa: string;
}
