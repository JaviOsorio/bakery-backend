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
import { TaskDetailService } from './../services/task.detail.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import {
  CreateTaskDetailDto,
  UpdateTaskDetailDto,
} from './../dtos/task.detail.dtos';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks-detail')
export class TaskDetailController {
  constructor(private taskDetailService: TaskDetailService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
  @Get()
  async findAll() {
    return await this.taskDetailService.findAll();
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.taskDetailService.findOne(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() payload: CreateTaskDetailDto) {
    return await this.taskDetailService.create(payload);
  }

  // @Roles(Role.SUPERADMIN, Role.ADMIN)
  // @Put(':id')
  // async update(@Param('id') id: number, @Body() changes: UpdateTaskDetailDto) {
  //   return await this.taskDetailService.update(id, changes);
  // }

  // @Roles(Role.SUPERADMIN, Role.ADMIN)
  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   return await this.taskDetailService.remove(id);
  // }
}
