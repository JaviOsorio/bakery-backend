import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from './task.entity';
import { Ingredient } from './../../recipes/entities/ingredient.entity';
import { User } from './../../users/entities/user.entity';

@Entity({ name: 'task_detail' })
export class TaskDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  weight: number;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ name: 'item_id' })
  itemId: number;

  @ManyToOne(() => User, (user) => user.details)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Task, (task) => task.details)
  @JoinColumn({
    name: 'task_id',
  })
  task: Task;
}
