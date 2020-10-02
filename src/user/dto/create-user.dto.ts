import { MinLength, MaxLength, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @MinLength(1)
  @MaxLength(20)
  username: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @MinLength(8)
  @MaxLength(30)
  password: string;
}
