import { IsOptional } from 'class-validator';
import { ListDTO } from 'src/common/list.dto';

export class ListUserDTO extends ListDTO {
  @IsOptional()
  username?: string;

  @IsOptional()
  email?: string;
}
