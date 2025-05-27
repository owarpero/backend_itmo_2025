import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { IAttachment, ISubmission } from '../interfaces/entity.interfaces';
import { Submission } from './submission.entity';

@Entity('attachments')
export class Attachment implements IAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Submission, submission => submission.attachments)
  @JoinColumn({ name: 'submission_id' })
  submission: ISubmission;

  @Column({ type: 'uuid' })
  submission_id: string;

  @Column()
  file_path: string;

  @Column()
  original_filename: string;

  @CreateDateColumn()
  created_at: Date;
}
