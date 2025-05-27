import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('movie_matches')
export class MovieMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user1: User;

  @Column()
  user1_id: string;

  @ManyToOne(() => User)
  user2: User;

  @Column()
  user2_id: string;

  @Column()
  tmdb_movie_id: number;

  @CreateDateColumn()
  matched_at: Date;
}
