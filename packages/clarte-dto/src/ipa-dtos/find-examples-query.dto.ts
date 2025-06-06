import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindExamplesQueryDto {
  @IsOptional()
  @Type(() => Number) // why i need type here, if it's defined here, do I don't nee parseInt pipe
  @IsInt()
  @Min(1)
  @Max(1000) // Set a reasonable max limit to prevent abuse
  limit?: number;
}
