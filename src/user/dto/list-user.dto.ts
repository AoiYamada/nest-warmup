import { IsOptional } from 'class-validator';
import { ListDto } from 'src/common/list.dto';

export class ListUserDto extends ListDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  email?: string;
}
