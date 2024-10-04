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

import { CreateProductDto, UpdateProductDto } from '../dtos/product.dtos';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productService.findOne(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post()
  async create(@Body() payload: CreateProductDto) {
    return await this.productService.create(payload);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() changes: UpdateProductDto) {
    return await this.productService.update(id, changes);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.productService.remove(id);
  }
}
