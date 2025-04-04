import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
} from 'typeorm';
import { IpaSymbol } from './IpaSymbol.entity';
import { SoundCategory } from './SoundCategory.entity';

// --- SoundSubcategory Entity ---
@Entity('sound_subcategories')
@Unique(['category', 'name']) // Ensures name is unique within a category
export class SoundSubcategory {
  @PrimaryGeneratedColumn()
  id: number;

  // Owning side of the relationship with SoundCategory
  @ManyToOne(() => SoundCategory, (category) => category.subcategories, {
    nullable: false,
    onDelete: 'RESTRICT', // Match DB constraint
  })
  @JoinColumn({ name: 'category_id' }) // Explicitly specify the foreign key column name
  category: SoundCategory;

  @Column({ name: 'category_id' }) // Expose the foreign key ID if needed directly
  categoryId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // 'Oral', 'Nasal', 'Voiced', 'Voiceless', etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Inverse side of the relationship with IpaSymbol
  @OneToMany(() => IpaSymbol, (ipaSymbol) => ipaSymbol.subcategory)
  ipaSymbols: IpaSymbol[];
}
