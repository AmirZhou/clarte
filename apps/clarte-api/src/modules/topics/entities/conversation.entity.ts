import {
  PrimaryColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Subtopic } from './subtopic.entity';
import { Assignment } from './assignment.entity';
import { Sentence } from './sentence.entity';

@Entity()
export class Conversation {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'difficulty_level', nullable: true })
  difficultyLevel?: string; // I may update this to Enum, but currently I got no benifits

  @Column({ name: 'audio_url', nullable: true })
  audioUrl?: string;

  @OneToMany(() => Assignment, (assignment) => assignment.conversation)
  assignments: Assignment[];

  @OneToMany(() => Sentence, (sentence) => sentence.conversation)
  sentences: Sentence[];

  @ManyToOne(() => Subtopic, (subtopic) => subtopic.conversations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subtopic_id' })
  subtopic: Subtopic;
}
