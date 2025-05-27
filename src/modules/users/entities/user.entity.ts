import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Group } from '../../groups/entities/group.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  @Exclude()
  password_hash: string;

  @Column({ nullable: true })
  @Exclude()
  google_2fa_secret?: string;

  @Column({ default: false })
  is_2fa_enabled: boolean;

  @ManyToOne(() => Group, group => group.users)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ type: 'uuid', nullable: true })
  group_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
