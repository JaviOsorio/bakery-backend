import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from './../dtos/ingredient.dtos';
import { Ingredient } from './../entities/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
  ) {}

  async findAll() {
    return await this.ingredientRepo.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }
    return ingredient;
  }

  async create(data: CreateIngredientDto) {
    const newRecipe = await this.ingredientRepo.create(data);
    return await this.ingredientRepo.save(newRecipe);
  }

  async update(id: number, changes: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    this.ingredientRepo.merge(ingredient, changes);
    return await this.ingredientRepo.save(ingredient);
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id);
    return this.ingredientRepo.delete(id);
  }
}
