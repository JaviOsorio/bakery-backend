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

@Entity({ name: 'task_detail' })
export class TaskDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  weight: number;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @ManyToOne(() => Task, (task) => task.details)
  @JoinColumn({
    name: 'task_id',
  })
  task: Task;
}
