import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import {
  ISubmission,
  IUser,
  ITask,
  IAttachment,
} from '../interfaces/entity.interfaces';

import { User } from './user.entity';
import { Task } from './task.entity';
import { Attachment } from './attachment.entity';

@Entity('submissions')
export class Submission implements ISubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: IUser;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: ITask;

  @Column({ type: 'uuid' })
  task_id: string;

  @Column()
  file_path: string;

  @Column()
  original_filename: string;

  @OneToMany(() => Attachment, attachment => attachment.submission)
  attachments: IAttachment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
