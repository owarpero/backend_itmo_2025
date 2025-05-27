import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ITaskType, ITask } from '../interfaces/entity.interfaces';

@Entity('task_types')
export class TaskType implements ITaskType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  code: string;

  @OneToMany('Task', 'type')
  tasks: ITask[];
}
