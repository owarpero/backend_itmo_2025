import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('movie_matches')
@Index(['user1_id', 'user2_id', 'tmdb_movie_id'], { unique: true })
export class MovieMatch {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'First user in the match' })
  @Column()
  user1_id: string;

  @ApiProperty({ description: 'Second user in the match' })
  @Column()
  user2_id: string;

  @ApiProperty({ description: 'TMDb movie ID that both users matched on' })
  @Column()
  tmdb_movie_id: number;

  @ApiProperty({
    description: 'Additional movie details stored at match time',
    required: false,
  })
  @Column('jsonb', { nullable: true })
  movie_details: {
    title: string;
    poster_path: string;
    release_date: string;
    overview?: string;
    vote_average?: number;
  };

  @ApiProperty({ description: 'Timestamp when the match occurred' })
  @CreateDateColumn()
  matched_at: Date;
}
