import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SingInDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
