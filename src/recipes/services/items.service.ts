import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto, UpdateItemtDto } from '../dtos/items.dtos';
import { Items } from '../entities/items.entity';
import { Product } from '../entities/product.entity';
import { Ingredient } from '../entities/ingredient.entity';

export class ItemsService {
  constructor(
    @InjectRepository(Items)
    private itemsRepo: Repository<Items>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
  ) {}

  async findAll() {
    return await this.itemsRepo.find();
  }

  async findOne(id: number) {
    const recipe = await this.itemsRepo.findOne({
      where: { id },
      relations: ['ingredient'],
    });

    if (!recipe) {
      throw new NotFoundException('Product not found');
    }
    return recipe;
  }

  async create(data: CreateItemDto) {
    const newRecipe = await this.itemsRepo.create(data);
    if (data.productId) {
      const product = await this.productRepo.findOne({
        where: { id: data.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${data.productId} not found`);
      }
      newRecipe.product = product;
    }

    if (data.ingredientId) {
      const ingredient = await this.ingredientRepo.findOne({
        where: { id: data.ingredientId },
      });
      if (!ingredient) {
        throw new NotFoundException(
          `Ingredient ${data.ingredientId} not found`,
        );
      }
      newRecipe.ingredient = ingredient;
    }

    return await this.itemsRepo.save(newRecipe);
  }

  async update(id: number, changes: UpdateItemtDto) {
    const recipe = await this.findOne(id);
    if (changes.productId) {
      const product = await this.productRepo.findOne({
        where: { id: changes.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${changes.productId} not found`);
      }
      recipe.product = product;
    }

    if (changes.ingredientId) {
      const ingredient = await this.ingredientRepo.findOne({
        where: { id: changes.ingredientId },
      });
      if (!ingredient) {
        throw new NotFoundException(
          `Ingredient ${changes.ingredientId} not found`,
        );
      }
      recipe.ingredient = ingredient;
    }
    this.itemsRepo.merge(recipe, changes);
    return await this.itemsRepo.save(recipe);
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    return this.itemsRepo.delete(id);
  }
}
