// src/entities/movie-match.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('movie_matches')
export class MovieMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tmdb_movie_id', type: 'int' })
  tmdbMovieId: number;

  @ManyToOne(() => User, user => user.matchesAsUser1, { eager: true })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, user => user.matchesAsUser2, { eager: true })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @CreateDateColumn({ name: 'matched_at' })
  matchedAt: Date;

  @Column('jsonb', { name: 'movie_details' })
  movieDetails: any;
}
