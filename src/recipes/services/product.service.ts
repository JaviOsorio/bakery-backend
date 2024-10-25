import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { ItemsService } from './items.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private itemsService: ItemsService,
  ) {}

  async findAll() {
    return await this.productRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['items', 'items.ingredient'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = await this.productRepo.create(data);
    return await this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    try {
      // Eliminar los items asociados al producto (await para asegurar que se complete)
      await this.itemsService.remove(id);

      // Buscar el producto existente
      const product = await this.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // Actualizar el producto con los cambios
      this.productRepo.merge(product, changes);

      // Guardar el producto actualizado
      return await this.productRepo.save(product);
    } catch (error) {
      // Manejar cualquier error que ocurra durante la eliminación o actualización
      throw new InternalServerErrorException(
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    // Eliminar los items asociados al producto (await para asegurar que se complete)
    await this.itemsService.remove(id);
    const product = await this.findOne(id);
    return this.productRepo.delete(id);
  }
}
