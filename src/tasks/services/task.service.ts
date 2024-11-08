import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
// import { Cron } from 'nestjs-schedule';
import { Cron } from '@nestjs/schedule';

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

  async findAll(starDate, endDate) {
    return await this.taskRepo.find({
      relations: [
        'product.items.ingredient',
        'details.ingredient',
        'details.user',
      ],
      where: {
        startDate: Between(
          new Date(`${starDate} 00:00`),
          new Date(`${endDate} 11:59`),
        ),
      },
    });
  }

  async filter(starDate, endDate) {
    const ingredients = await this.taskRepo.find({
      relations: ['product.items.ingredient', 'details.ingredient'],
      where: {
        startDate: Between(
          new Date(`${starDate} 00:00`),
          new Date(`${endDate} 11:59`),
        ),
      },
    });

    // Creamos dos objetos para almacenar la agrupación de los ingredientes tanto en items como en details.
    const itemSummary = {};
    const detailSummary = {};

    // Función para agrupar ingredientes en los items.
    ingredients.forEach((batch) => {
      batch.product.items.forEach((item) => {
        const ingredientId = item.ingredient.id;
        const ingredientName = item.ingredient.name;
        const controlUnit = item.controlUnit;

        // Asegúrate de que cuantity sea un número
        const quantity = Number(item.cuantity); // Convierto a número

        // Si el ingrediente ya existe en el objeto, sumamos la cantidad.
        if (itemSummary[ingredientId]) {
          itemSummary[ingredientId].cuantity += quantity; // Sumar cantidades
        } else {
          // Si no existe, lo creamos con la cantidad actual.
          itemSummary[ingredientId] = {
            id: ingredientId,
            name: ingredientName,
            cuantity: quantity, // Guardar cantidad como número
            controlUnit,
          };
        }
      });
    });

    // Función para agrupar ingredientes en los details.
    ingredients.forEach((batch) => {
      batch.details.forEach((detail) => {
        const ingredientId = detail.ingredient.id;
        const ingredientName = detail.ingredient.name;

        // Asegúrate de que weight sea un número
        const weight = Number(detail.weight); // Convierto a número

        // Si el ingrediente ya existe en el objeto, sumamos el peso.
        if (detailSummary[ingredientId]) {
          detailSummary[ingredientId].weight += weight; // Sumar pesos
        } else {
          // Si no existe, lo creamos con el peso actual.
          detailSummary[ingredientId] = {
            id: ingredientId,
            name: ingredientName,
            weight: weight, // Guardar peso como número
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
        controlUnit: item.controlUnit,
      };
    });
    return comparison;
  }

  async findOne(id: number) {
    return await this.taskRepo.findOne({
      where: { id },
      relations: [
        'product.items.ingredient',
        'details.ingredient',
        'details.user',
      ],
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

  // @Cron('*/1 * * * *')
  @Cron('0 23 * * *')
  async removeTasksPending() {
    console.log('task executed');
    await this.taskRepo.delete({ status: 'Pendiente' });
  }
}
