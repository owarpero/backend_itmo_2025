import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ITaskType } from '../interfaces/entity.interfaces';
import { Task } from 'entities';

@Entity('task_types')
export class TaskType implements ITaskType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  code: string;

  @OneToMany(() => Task, task => task.type)
  tasks: Task[];
}
