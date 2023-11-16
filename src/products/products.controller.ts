import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Products> {
    return await this.productsService.createProduct(createProductDto);
  }

  @Get('products')
  async findProducts(): Promise<Products[]> {
    return await this.productsService.findProducts();
  }

  @Get('products/:id')
  async findOneProduct(@Param('id') id: number): Promise<Products | object> {
    return await this.productsService.findOneProduct(id);
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() newData: UpdateProductDto,
  ): Promise<Products | object> {
    return await this.productsService.updateProduct(id, newData);
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number): Promise<Products | object> {
    return await this.productsService.deleteProduct(id);
  }
}
