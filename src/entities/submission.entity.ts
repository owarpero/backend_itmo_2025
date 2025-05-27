import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  ISubmission,
  IUser,
  ITask,
  IAttachment,
} from '../interfaces/entity.interfaces';

@Entity('submissions')
export class Submission implements ISubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User')
  user: IUser;

  @Column()
  user_id: string;

  @ManyToOne('Task')
  task: ITask;

  @Column()
  task_id: string;

  @Column()
  file_path: string;

  @Column()
  original_filename: string;

  @OneToMany('Attachment', 'submission')
  attachments: IAttachment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
