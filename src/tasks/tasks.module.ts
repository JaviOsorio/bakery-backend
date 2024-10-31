import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
import { TaskDetail } from './entities/task.detail.entity';
import { Product } from './../recipes/entities/product.entity';
import { TaskDetailService } from './services/task.detail.service';
import { TaskDetailController } from './controllers/task.detail.controller';
import { Ingredient } from 'src/recipes/entities/ingredient.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskDetail, Product, Ingredient, User]),
  ],
  controllers: [TaskController, TaskDetailController],
  providers: [TaskService, TaskDetailService],
})
export class TasksModule {}
