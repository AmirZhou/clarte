import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class IpaWithoutExamplesDto {
  @Expose()
  @Transform(
    ({ value }) => {
      // value: the incoming string ID from the IpaSymbol entity
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    },
    { toClassOnly: true }
  )
  id: number;

  @Expose()
  symbol: string;

  @Expose()
  description?: string;

  @Expose()
  category?: string;

  @Expose()
  subCategory?: string;
}
