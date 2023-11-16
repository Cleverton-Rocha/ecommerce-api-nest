import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image?: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  price?: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  texture?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  weight?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  size?: string;
}
