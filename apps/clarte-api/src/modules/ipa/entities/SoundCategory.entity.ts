import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SoundSubcategory } from './SoundSubcategory.entity';

// --- SoundCategory Entity ---
@Entity('sound_categories')
export class SoundCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // 'Vowel', 'Consonant'

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Inverse side of the relationship
  @OneToMany(() => SoundSubcategory, (subcategory) => subcategory.category)
  subcategories: SoundSubcategory[];
}
