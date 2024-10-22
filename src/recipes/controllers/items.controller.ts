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

import { CreateItemDto, UpdateItemtDto } from '../dtos/items.dtos';
import { ItemsService } from '../services/items.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items')
@ApiTags('Items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  async findAll() {
    return await this.itemsService.findAll();
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.itemsService.findOne(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  async create(@Body() payload: CreateItemDto) {
    return await this.itemsService.create(payload);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() changes: UpdateItemtDto) {
    return await this.itemsService.update(id, changes);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.itemsService.remove(id);
  }
}
