import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Products } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productsList: Products[] = [
  new Products({
    id: 1,
    name: 'Mock Product',
    description: 'Mock Product',
    image: 'Mock Product',
    price: 15,
    size: 'Mock Product',
    texture: 'Mock Product',
    weight: 'Mock Product',
  }),
  new Products({
    id: 2,
    name: 'Mock Product',
    description: 'Mock Product',
    image: 'Mock Product',
    price: 15,
    size: 'Mock Product',
    texture: 'Mock Product',
    weight: 'Mock Product',
  }),
];

const mockProduct: Products = {
  id: 1,
  name: 'Mock Product',
  description: 'Mock Product',
  image: 'Mock Product',
  price: 15,
  size: 'Mock Product',
  texture: 'Mock Product',
  weight: 'Mock Product',
};

const updatedProduct: Products = {
  id: 1,
  name: 'New Product value',
  description: 'New Product value',
  image: 'New Product value',
  price: 15,
  size: 'New Product value',
  texture: 'New Product value',
  weight: 'New Product value',
};

const createBody: CreateProductDto = {
  name: 'Mock Product',
  description: 'Mock Product',
  image: 'Mock Product',
  price: 15,
  size: 'Mock Product',
  texture: 'Mock Product',
  weight: 'Mock Product',
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
          provide: ProductsService,
          useValue: {
            createProduct: jest.fn().mockResolvedValue(mockProduct),
            findProducts: jest.fn().mockResolvedValue(productsList),
            findOneProduct: jest.fn().mockResolvedValue(mockProduct),
            updateProduct: jest.fn().mockResolvedValue(updatedProduct),
            deleteProduct: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('createProduct', () => {
    it('Should create a new product successfully', async () => {
      const result = await productsController.createProduct(createBody);

      expect(result).toEqual(mockProduct);
      expect(productsService.createProduct).toHaveBeenCalledTimes(1);
      expect(productsService.createProduct).toHaveBeenCalledWith(createBody);
    });
    it('Should return an error if it cannot complete the promise', () => {
      jest
        .spyOn(productsService, 'createProduct')
        .mockRejectedValueOnce(new Error());

      expect(productsController.createProduct(createBody)).rejects.toThrow(
        Error,
      );
    });
  });
  describe('findProducts', () => {
    it('Should return a list of products', async () => {
      const result = await productsController.findProducts();
      expect(result).toEqual(productsList);
      expect(productsService.findProducts).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if it cannot complete the promise', () => {
      jest
        .spyOn(productsService, 'findProducts')
        .mockRejectedValueOnce(new Error());

      expect(productsController.findProducts()).rejects.toThrow(Error);
    });
  });

  describe('findOneProduct', () => {
    it('Should return a product for the given id', async () => {
      const productID = 1;
      const result = await productsController.findOneProduct(productID);

      expect(result).toEqual(mockProduct);
      expect(productsService.findOneProduct).toHaveBeenCalledTimes(1);
      expect(productsService.findOneProduct).toHaveBeenCalledWith(productID);
    });
    it('Should return an error if it cannot complete the promise', () => {
      const productID = 1;
      jest
        .spyOn(productsService, 'findOneProduct')
        .mockRejectedValueOnce(new Error());

      expect(productsController.findOneProduct(productID)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('updateProduct', () => {
    it('Should update a product for the given id', async () => {
      const productID = 1;

      const updateBody: UpdateProductDto = {
        name: 'New Product value',
        description: 'New Product value',
        image: 'New Product value',
        price: 15,
        size: 'New Product value',
        texture: 'New Product value',
        weight: 'New Product value',
      };

      const result = await productsController.updateProduct(
        productID,
        updateBody,
      );

      expect(result).toEqual(updatedProduct);
      expect(productsService.updateProduct).toHaveBeenCalledTimes(1);

      expect(productsService.updateProduct).toHaveBeenCalledWith(
        productID,
        updateBody,
      );
    });

    it('Should return an error if it cannot complete the promise', () => {
      const productID = 1;

      const updateBody: UpdateProductDto = {
        name: 'New Product value',
        description: 'New Product value',
        image: 'New Product value',
        price: 15,
        size: 'New Product value',
        texture: 'New Product value',
        weight: 'New Product value',
      };

      jest
        .spyOn(productsService, 'updateProduct')
        .mockRejectedValueOnce(new Error());

      expect(
        productsController.updateProduct(productID, updateBody),
      ).rejects.toThrow(Error);
    });
  });

  describe('deleteProduct', () => {
    it('Should remove a product for the given id', async () => {
      const productID = 1;

      const result = await productsController.deleteProduct(productID);

      expect(result).toEqual(mockProduct);
      expect(productsService.deleteProduct).toHaveBeenCalledTimes(1);
      expect(productsService.deleteProduct).toHaveBeenCalledWith(productID);
    });

    it('Should return an error if it cannot complete the promise', () => {
      const productID = 1;

      jest
        .spyOn(productsService, 'deleteProduct')
        .mockRejectedValueOnce(new Error());

      expect(productsController.deleteProduct(productID)).rejects.toThrow(
        Error,
      );
    });
  });
});
