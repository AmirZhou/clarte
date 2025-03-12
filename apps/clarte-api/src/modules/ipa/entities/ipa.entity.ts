import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ipa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ipaSymbol: string;
}
