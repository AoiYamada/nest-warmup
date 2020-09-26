import { MinLength, MaxLength } from 'class-validator';

export class CreateTodoDTO {
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @MinLength(1)
  content: string;
}
