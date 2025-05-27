import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { IAttachment, ISubmission } from '../interfaces/entity.interfaces';

@Entity('attachments')
export class Attachment implements IAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Submission', 'attachments')
  submission: ISubmission;

  @Column()
  submission_id: string;

  @Column()
  file_path: string;

  @Column()
  original_filename: string;

  @CreateDateColumn()
  created_at: Date;
}
