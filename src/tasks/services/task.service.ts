import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './../entities/task.entity';
import { Product } from './../../recipes/entities/product.entity';
import { CreateTaskDto } from './../dtos/task.dtos';
import { TaskDetailService } from './task.detail.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private taskDetailService: TaskDetailService,
  ) {}

  async findAll() {
    return await this.taskRepo.find({
      relations: ['product.items.ingredient', 'details.ingredient'],
    });
  }

  async filter() {
    const ingredients = await this.taskRepo.find({
      relations: ['product.items.ingredient', 'details.ingredient'],
    });

    // Creamos dos objetos para almacenar la agrupación de los ingredientes tanto en items como en details.
    const itemSummary = {};
    const detailSummary = {};

    // Función para agrupar ingredientes en los items.
    ingredients.forEach((batch) => {
      batch.product.items.forEach((item) => {
        const ingredientId = item.ingredient.id;
        const ingredientName = item.ingredient.name;

        // Si el ingrediente ya existe en el objeto, sumamos la cantidad.
        if (itemSummary[ingredientId]) {
          itemSummary[ingredientId].cuantity += item.cuantity;
        } else {
          // Si no existe, lo creamos con la cantidad actual.
          itemSummary[ingredientId] = {
            id: ingredientId,
            name: ingredientName,
            cuantity: item.cuantity,
          };
        }
      });
    });

    // Función para agrupar ingredientes en los details.
    ingredients.forEach((batch) => {
      batch.details.forEach((detail) => {
        const ingredientId = detail.ingredient.id;
        const ingredientName = detail.ingredient.name;

        // Si el ingrediente ya existe en el objeto, sumamos el peso.
        if (detailSummary[ingredientId]) {
          detailSummary[ingredientId].weight += detail.weight;
        } else {
          // Si no existe, lo creamos con el peso actual.
          detailSummary[ingredientId] = {
            id: ingredientId,
            name: ingredientName,
            weight: detail.weight,
          };
        }
      });
    });

    // Comparamos los dos resúmenes (items y details) y generamos un nuevo array que contenga ambos datos.
    const comparison = Object.keys(itemSummary).map((ingredientId) => {
      const item = itemSummary[ingredientId];
      const detail = detailSummary[ingredientId] || { weight: 0 }; // Si no hay peso en details, asumimos 0.

      return {
        id: item.id,
        name: item.name,
        cuantity: item.cuantity,
        weight: detail.weight,
      };
    });
    return comparison;
  }

  async findOne(id: number) {
    return await this.taskRepo.findOne({
      where: { id },
      relations: ['product.items.ingredient', 'details.ingredient'],
    });
  }

  async create(data: CreateTaskDto) {
    const newTask = await this.taskRepo.create(data);
    if (data.productId) {
      const product = await this.productRepo.findOne({
        where: { id: data.productId },
        relations: ['items', 'items.ingredient'],
      });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      newTask.product = product;
    }
    for (let index = 1; index <= data.repetition; index++) {
      newTask.repetition = 1;
      const taskCreated = this.taskRepo.save(newTask);
      // Create detail task
      // if (taskCreated) {
      //   // await this.taskDetailService.create({
      //   //   ingredientId: ,
      //   //   weight: ,
      //   //   taskId: taskCreated.id,
      //   // });
      // }
    }
    return data;
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
