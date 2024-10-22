import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from './../../recipes/entities/product.entity';
import { TaskDetail } from './task.detail.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ name: 'production_batch', type: 'varchar', length: 255 })
  productionBatch: string;

  @Column({ name: 'start_date', type: 'timestamp', default: null })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', default: null })
  endDate: Date;

  @Column({ type: 'varchar', length: 255 })
  unit: string;

  @Column({ type: 'int' })
  repetition: number;

  @ManyToOne(() => Product, (product) => product.tasks)
  product: Product;

  @OneToMany(() => TaskDetail, (taskDetail) => taskDetail.task)
  details: TaskDetail[];
}
