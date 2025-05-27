import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ITask } from '../interfaces/entity.interfaces';
import { TaskType } from 'entities';

@Entity('tasks')
export class Task implements ITask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => TaskType, type => type.tasks)
  @JoinColumn({ name: 'type_id' })
  type: TaskType;

  @Column({ type: 'uuid' })
  type_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
