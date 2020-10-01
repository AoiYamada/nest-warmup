import { MinLength, MaxLength, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(30)
  password?: string;
}
