import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Product } from './product.entity';

@Entity({ name: 'items' })
export class Items {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  cuantity: number;

  @Column({ name: 'control_unit', type: 'varchar', length: 255 })
  controlUnit: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateAt: Date;

  @ManyToOne(() => Product, (product) => product.items)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.items)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
