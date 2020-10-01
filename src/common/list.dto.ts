import { Min, Max, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export abstract class ListDto {
  @IsOptional()
  @Transform((page) => parseInt(page))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform((limit) => parseInt(limit))
  @IsInt()
  @Min(5)
  @Max(100)
  limit?: number;
}
