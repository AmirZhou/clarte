import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IpaSymbol } from '../../ipa/entities/IpaSymbol.entity';

@Entity('dictionary_entries')
export class DictionaryEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  frenchEntry: string;

  @Column({ type: 'varchar', length: 255 })
  ipaNotation: string;

  @Column({ type: 'text', nullable: true })
  translation?: string;

  @Column({ type: 'smallint', nullable: true })
  length?: number;

  @ManyToMany(() => IpaSymbol, (ipa) => ipa.dictionaryEntries)
  @JoinTable({
    name: 'dictionary_entry_ipa_symbols',
    joinColumn: { name: 'entry_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ipa_symbol_id', referencedColumnName: 'id' },
  })
  ipaSymbols: IpaSymbol[];
}
