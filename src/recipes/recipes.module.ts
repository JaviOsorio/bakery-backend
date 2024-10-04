import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Items } from './entities/items.entity';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';
import { ItemsService } from './services/items.service';
import { ItemsController } from './controllers/items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Ingredient, Items])],
  controllers: [ProductController, IngredientController, ItemsController],
  providers: [ProductService, IngredientService, ItemsService],
})
export class RecipesModule {}
