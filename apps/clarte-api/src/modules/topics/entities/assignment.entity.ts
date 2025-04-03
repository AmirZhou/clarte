import { PrimaryColumn, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class Assignment {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}
