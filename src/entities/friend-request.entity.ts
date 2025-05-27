import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  from_user: User;

  @Column()
  from_user_id: string;

  @ManyToOne(() => User)
  to_user: User;

  @Column()
  to_user_id: string;

  @CreateDateColumn()
  created_at: Date;
}
