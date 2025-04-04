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
} from 'typeorm';

import { SoundSubcategory } from './SoundSubcategory.entity';
import { Example } from './Example.entity';

@Entity('ipa_symbols')
export class IpaSymbol {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' }) // Match BIGSERIAL
  id: number; // Use string if dealing with very large numbers potentially beyond JS Number limits, but number is usually fine

  // Owning side of the relationship with SoundSubcategory
  @ManyToOne(() => SoundSubcategory, (subcategory) => subcategory.ipaSymbols, {
    nullable: false,
    onDelete: 'RESTRICT', // Match DB constraint
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SoundSubcategory;

  @Index() // Index the foreign key ID column
  @Column({ name: 'subcategory_id' })
  subcategoryId: number;

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
}
