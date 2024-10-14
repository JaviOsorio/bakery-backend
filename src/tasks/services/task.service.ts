import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './../entities/task.entity';
import { Product } from './../../recipes/entities/product.entity';
import { CreateTaskDto } from './../dtos/task.dtos';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return await this.taskRepo.find({
      relations: ['product', 'product.items.ingredient', 'details.ingredient'],
    });
  }

  async findOne(id: number) {
    return await this.taskRepo.findOne({
      where: { id },
      relations: ['product', 'product.items.ingredient', 'details.ingredient'],
    });
  }

  async create(data: CreateTaskDto) {
    const newTask = await this.taskRepo.create(data);
    if (data.productId) {
      const product = await this.productRepo.findOne({
        where: { id: data.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      newTask.product = product;
    }
    return this.taskRepo.save(newTask);
  }

  async update(id: number, changes: any) {
    const task = await this.findOne(id);
    if (changes.productId) {
      const product = await this.productRepo.findOne({
        where: { id: changes.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      task.product = product;
    }
    this.taskRepo.merge(task, changes);
    return await this.taskRepo.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return await this.taskRepo.delete(id);
  }
}
