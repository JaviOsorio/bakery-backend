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
import { ApiTags } from '@nestjs/swagger';

import { IngredientService } from '../services/ingredient.service';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from '../dtos/ingredient.dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingredients')
@ApiTags('Ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  async findAll() {
    return await this.ingredientService.findAll();
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.ingredientService.findOne(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  async create(@Body() payload: CreateIngredientDto) {
    return await this.ingredientService.create(payload);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() changes: UpdateIngredientDto) {
    return await this.ingredientService.update(id, changes);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.ingredientService.remove(id);
  }
}
