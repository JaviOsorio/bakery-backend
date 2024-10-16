import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './../services/task.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { CreateTaskDto } from './../dtos/task.dtos';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  async findAll() {
    return await this.taskService.findAll();
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.taskService.findOne(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  async create(@Body() payload: CreateTaskDto) {
    console.log(payload);
    return await this.taskService.create(payload);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() changes: any) {
    console.log(changes);
    
    return await this.taskService.update(id, changes);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.taskService.remove(id);
  }
}
