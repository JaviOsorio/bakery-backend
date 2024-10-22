import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './../entities/task.entity';
import { TaskDetail } from './../entities/task.detail.entity';
import { Ingredient } from './../../recipes/entities/ingredient.entity';
import {
  CreateTaskDetailDto,
  UpdateTaskDetailDto,
} from './../dtos/task.detail.dtos';

@Injectable()
export class TaskDetailService {
  constructor(
    @InjectRepository(TaskDetail)
    private readonly taskDetailRepo: Repository<TaskDetail>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Ingredient) private readonly ingredienRepo: Repository<Ingredient>,
  ) {}

  async findAll() {
    return await this.taskDetailRepo.find({
      relations: ['task.product.items'],
    });
  }

  async findOne(id: number) {
    return await this.taskDetailRepo.findOne({ where: { id } });
  }

  async create(data: CreateTaskDetailDto) {
    const ingredient = await this.ingredienRepo.findOne({
      where: { id: data.ingredientId },
    });
    if (!ingredient) {
      throw new Error('Ingredient not found');
    }

    // Buscar el `Task` usando el `taskId` del DTO
    const task = await this.taskRepo.findOne({ where: { id: data.taskId } });
    if (!task) {
      throw new Error('Task not found');
    }

    // Crear el nuevo `TaskDetail`
    const newTaskDetail = this.taskDetailRepo.create({
      weight: data.weight,
      ingredient,
      task,
    });

    return await this.taskDetailRepo.save(newTaskDetail);
  }

  // async update(id: number, changes: UpdateTaskDetailDto) {
  //   const taskDetail = await this.findOne(id);
  //   if (changes.taskId) {
  //     const task = await this.taskRepo.findOne({
  //       where: { id: changes.taskId },
  //     });
  //     if (!task) {
  //       throw new NotFoundException(`Product not found`);
  //     }
  //     taskDetail.task = task;
  //   }
  //   this.taskDetailRepo.merge(taskDetail, changes);
  //   return await this.taskDetailRepo.save(taskDetail);
  // }
}
