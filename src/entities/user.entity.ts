import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser, IGroup } from '../interfaces/entity.interfaces';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  google_2fa_secret?: string;

  @Column({ default: false })
  is_2fa_enabled: boolean;

  @ManyToOne('Group', 'users', { nullable: true })
  group?: IGroup;

  @Column({ type: 'uuid', nullable: true })
  group_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
