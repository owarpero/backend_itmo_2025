import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('friendships')
export class Friendship {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  friend_id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  friend: User;

  @CreateDateColumn()
  created_at: Date;
}
