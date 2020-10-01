import { IsOptional } from 'class-validator';
import { ListDto } from 'src/common/list.dto';

export class ListTodoDto extends ListDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;
}
