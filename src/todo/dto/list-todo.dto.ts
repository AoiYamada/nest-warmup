import { IsOptional } from 'class-validator';
import { ListDTO } from 'src/common/list.dto';

export class ListTodoDTO extends ListDTO {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;
}
