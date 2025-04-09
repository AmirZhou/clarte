import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class DictionaryEntryExampleDto {
  @Expose()
  id: number;
  @Expose()
  frenchEntry: string;
  @Expose()
  ipaNotation: string;
}
