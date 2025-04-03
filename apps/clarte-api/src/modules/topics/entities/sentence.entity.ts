import { PrimaryColumn, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class Sentence {
  @PrimaryColumn()
  id: number;

  @Column()
  text: string;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl?: string;

  @Column({ name: 'sequence_number' })
  sequenceNumber: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.sentences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}
