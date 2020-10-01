import { MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDTO {
  @MinLength(1)
  @MaxLength(20)
  username: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @MinLength(8)
  @MaxLength(30)
  password: string;
}
