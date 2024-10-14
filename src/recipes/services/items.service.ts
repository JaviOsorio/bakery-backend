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

  async findByProductId(productId: number) {
    const items = await this.itemsRepo.find({
      where: {
        product: { id: productId },
      },
      relations: ['ingredient'],
    });
    if (!items || items.length === 0) {
      throw new NotFoundException('Items not found');
    }
    return items;
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
    const items = await this.findByProductId(id);

    // Verificar si hay elementos asociados a la receta
    if (!items || items.length === 0) {
      throw new NotFoundException('No hay elementos asociados a esta receta.');
    }

    // Obtener los IDs de los elementos a eliminar
    const itemIds = items.map((item) => item.id); // Asegúrate de que 'id' sea el campo correcto

    // Eliminar los elementos
    await this.itemsRepo.delete(itemIds);

    // (Opcional) Si necesitas eliminar la receta después de eliminar sus elementos
    // await this.recipesRepo.delete(recipeId);

    return { message: 'Elementos eliminados correctamente.' };
  }
}
