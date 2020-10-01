import { MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @MinLength(1)
  @MaxLength(20)
  username: string;

  @MinLength(8)
  @MaxLength(30)
  password: string;
}
