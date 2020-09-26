import { MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateTodoDTO {
  @IsOptional()
  @MinLength(1)
  @MaxLength(20)
  title?: string;

  @IsOptional()
  @MinLength(1)
  content?: string;
}
