import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Products> {
    const newProduct = this.productsRepository.create(createProductDto);
    await this.productsRepository.save(newProduct);
    return newProduct;
  }

  async findProducts(): Promise<Products[]> {
    return this.productsRepository.find({ order: { id: 'ASC' } });
  }

  async findOneProduct(id: number): Promise<Products | object> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      return { error: 'product not found' };
    }
    return product;
  }

  async updateProduct(
    id: number,
    newData: UpdateProductDto,
  ): Promise<UpdateProductDto | object> {
    const productToUpdate = await this.productsRepository.findOne({
      where: { id },
    });

    if (!productToUpdate) {
      return { error: 'product not found' };
    }

    Object.assign(productToUpdate, newData);
    await this.productsRepository.save(productToUpdate);

    return productToUpdate;
  }

  async deleteProduct(id: number): Promise<Products | object> {
    const productToDelete = await this.productsRepository.findOne({
      where: { id },
    });

    if (!productToDelete) {
      return { error: 'product not found' };
    }

    await this.productsRepository.remove(productToDelete);
    return productToDelete;
  }
}
