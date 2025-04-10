//src/modules/ipa/entities/Example.entity.ts

import {
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IpaSymbol } from './IpaSymbol.entity';

// --- Example Entity ---
@Entity('examples')
export class Example {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  // Owning side of the relationship with IpaSymbol
  @ManyToOne(() => IpaSymbol, (ipaSymbol) => ipaSymbol.examples, {
    nullable: false,
    onDelete: 'CASCADE', // Match DB constraint
  })
  @JoinColumn({ name: 'ipa_symbol_id' })
  ipaSymbol: IpaSymbol;

  @Index() // Index the foreign key ID column
  @Column({ name: 'ipa_symbol_id' })
  ipaSymbolId: number;

  @Column({ name: 'french_text', type: 'varchar', length: 512 })
  frenchText: string; // 'papa', 'à aucun moment'

  @Column({
    name: 'english_translation',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  englishTranslation?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    name: 's3_audio_key_example',
  })
  s3AudioKeyExample?: string; // S3 key for the audio of this specific example

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
