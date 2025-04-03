import {
  PrimaryColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Topic } from './topic.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Subtopic {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Topic, (topic) => topic.subtopics, { onDelete: 'CASCADE' }) // do i use eager here? // so ondelete is defined on the many side?
  @JoinColumn({ name: 'topic_id' }) // what's this do?
  topic: Topic;

  @OneToMany(() => Conversation, (conversation) => conversation.subtopic)
  conversations: Conversation[];
}
