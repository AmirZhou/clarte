import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';

export class FindAllIpaQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withExamples?: boolean;

  @IsOptional()
  @Type(() => Number) // why i need type here, if it's defined here, do I don't nee parseInt pipe
  @IsInt()
  @Min(1)
  @Max(1000) // Set a reasonable max limit to prevent abuse
  limit?: number;
}
