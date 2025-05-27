// src/entities/user.entity.ts
import { Group } from 'entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  password_hash: string;

  @ManyToOne(() => Group, group => group.users, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group?: Group;

  @Column({ type: 'uuid', nullable: true })
  group_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
