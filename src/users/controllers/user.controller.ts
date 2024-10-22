import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto } from './../dtos/user.dtos';
import { UserService } from './../services/user.service';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { RolesGuard } from './../../auth/guards/roles.guard';
import { Roles } from './../../auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { Public } from './../../auth/decorators/public.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List of users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.SUPERADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get the details of a user.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  // @Roles(Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Create user.' })
  async create(@Body() payload: CreateUserDto) {
    return await this.userService.create(payload);
  }

  @Roles(Role.SUPERADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update user.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return await this.userService.update(id, changes);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.userService.remove(id);
  }
}
