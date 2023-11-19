import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Repository } from 'typeorm';
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

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Products>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: {
            create: jest.fn().mockReturnValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
            find: jest.fn().mockResolvedValue(productsList),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            merge: jest.fn().mockReturnValue(mockProduct),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(productsRepository).toBeDefined();
  });

  describe('createProduct', () => {
    it('Should create a product successfuly', async () => {
      const data: CreateProductDto = {
        name: 'Mock Product',
        description: 'Mock Product',
        image: 'Mock Product',
        price: 15,
        size: 'Mock Product',
        texture: 'Mock Product',
        weight: 'Mock Product',
      };

      const result = await productsService.createProduct(data);

      expect(productsRepository.create).toHaveBeenCalledTimes(1);
      expect(productsRepository.create).toHaveBeenCalledWith(data);

      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledWith(mockProduct);

      expect(result).toEqual(mockProduct);
    });

    it('Should return an error if it cannot complete the promise', () => {
      const data: CreateProductDto = {
        name: 'Mock Product',
        description: 'Mock Product',
        image: 'Mock Product',
        price: 15,
        size: 'Mock Product',
        texture: 'Mock Product',
        weight: 'Mock Product',
      };

      jest
        .spyOn(productsRepository, 'create')
        .mockRejectedValue(new Error() as never);

      expect(productsService.createProduct(data)).rejects.toThrow(Error);
    });
  });

  describe('findProducts', () => {
    it('Should return a list of Products', async () => {
      const result = await productsService.findProducts();

      expect(productsRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(productsList);
    });
    it('Should return an error if it cannot complete the promise', () => {
      jest.spyOn(productsRepository, 'find').mockRejectedValue(new Error());

      expect(productsService.findProducts()).rejects.toThrow(Error);
    });
  });

  describe('findOneProduct', () => {
    it('Should return one product for the given id', async () => {
      const productID = 1;
      const result = await productsService.findOneProduct(productID);

      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productID },
      });
      expect(result).toEqual(mockProduct);
    });

    it('Should return "product not found" when the given ID does not match a product', async () => {
      const productID = 1;
      jest
        .spyOn(productsRepository, 'findOne')
        .mockRejectedValue(new Error('product not found'));

      expect(productsService.findOneProduct(productID)).rejects.toThrow(
        'product not found',
      );
    });
  });

  describe('updateProduct', () => {
    it('Should update a product for the given id', async () => {
      const productID = 1;

      const updateBody: UpdateProductDto = {
        name: 'Mock Product',
        description: 'Mock Product',
        image: 'Mock Product',
        price: 15,
        size: 'Mock Product',
        texture: 'Mock Product',
        weight: 'Mock Product',
      };

      const result = await productsService.updateProduct(productID, updateBody);

      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productID },
      });

      expect(productsRepository.merge).toHaveBeenCalledTimes(1);
      expect(productsRepository.merge).toHaveBeenCalledWith(
        mockProduct,
        updateBody,
      );

      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
    it('Should return "product not found" when the given ID does not match a product', async () => {
      const productID = 1;
      jest
        .spyOn(productsRepository, 'findOne')
        .mockRejectedValue(new Error('product not found'));

      expect(productsService.findOneProduct(productID)).rejects.toThrow(
        'product not found',
      );
    });
  });
});

// Todo: deleteProduct test
