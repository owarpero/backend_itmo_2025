import { User } from 'entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('movie_matches')
export class MovieMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @Column({ type: 'uuid' })
  user1_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @Column({ type: 'uuid' })
  user2_id: string;

  @Column()
  tmdb_movie_id: number;

  @CreateDateColumn()
  matched_at: Date;
}
