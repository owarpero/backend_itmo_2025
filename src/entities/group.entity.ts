import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IGroup, IUser } from '../interfaces/entity.interfaces';

@Entity('groups')
export class Group implements IGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany('User', 'group')
  users: IUser[];
}
