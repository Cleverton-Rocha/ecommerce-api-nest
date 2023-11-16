import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException } from '@nestjs/common';

const mockProduct: Products = {
  id: 1,
  name: 'Mock Product',
  description: 'Product description',
  image: 'product_image.jpg',
  price: 10.99,
  texture: 'Product texture',
  weight: '15kg',
  size: '30x30',
};

const mockDataProduct: CreateProductDto = {
  name: 'Mock Product',
  description: 'Product description',
  image: 'product_image.jpg',
  price: 10.99,
  texture: 'Product texture',
  weight: '15kg',
  size: '30x30',
};

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useClass: Repository,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });
});
