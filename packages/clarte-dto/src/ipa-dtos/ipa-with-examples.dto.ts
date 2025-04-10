import { Exclude, Expose, Transform } from 'class-transformer';
import { DictionaryEntryExampleDto } from '../french-dictionary-dtos/dictionary-entry-example.dto';

@Exclude()
export class IpaWithExamplesDto {
  @Expose()
  @Transform(
    ({ value }) => {
      // value will be the incoming string ID from the IpaSymbol entity
      const num = Number(value);
      return isNaN(num) ? undefined : num; // Return number or undefined if conversion fails
    },
    { toClassOnly: true }
  ) // Only apply during plainToInstance
  id: number;

  @Expose()
  symbol: string;

  @Expose()
  description?: string;

  @Expose()
  category?: string; // vowel, consotants

  @Expose()
  subCategory?: string;

  @Expose()
  dictionaryEntries: DictionaryEntryExampleDto[];
}
