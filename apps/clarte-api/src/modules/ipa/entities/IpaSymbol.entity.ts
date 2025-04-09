import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { SoundSubcategory } from './SoundSubcategory.entity';
import { Example } from './Example.entity';
import { DictionaryEntry } from '../../dictionary/entities/DictionaryEntry.entity';

@Entity('ipa_symbols')
export class IpaSymbol {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' }) // Match BIGSERIAL
  id: number; // Use string if dealing with very large numbers potentially beyond JS Number limits, but number is usually fine

  // Owning side of the relationship with SoundSubcategory
  @ManyToOne(() => SoundSubcategory, (subcategory) => subcategory.ipaSymbols, {
    nullable: true, // <--- CHANGE THIS TO true
    onDelete: 'SET NULL', // Or 'RESTRICT', 'NO ACTION'. Consider what happens if a subcategory is deleted. 'SET NULL' is common with nullable relationships.
    // eager: false, // Eager loading is often false by default, but good to be explicit if needed
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SoundSubcategory | null;

  @Index() // Index the foreign key ID column
  @Column({ name: 'subcategory_id', nullable: true })
  subcategoryId: number | null;

  @Index({ unique: true }) // Index and ensure uniqueness
  @Column({ type: 'varchar', length: 20 })
  symbol: string; // e.g., '/a/', '/b/' - Store consistently!

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  pronunciationGuide?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    name: 's3_audio_key_sound',
  })
  s3AudioKeySound?: string; // S3 Key for the IPA sound itself

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Inverse side of the relationship with Example
  @OneToMany(() => Example, (example) => example.ipaSymbol)
  examples: Example[];

  @ManyToMany(() => DictionaryEntry, (entry) => entry.ipaSymbols)
  dictionaryEntries: DictionaryEntry[];
}
