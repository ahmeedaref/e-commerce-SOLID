import {
  IsString,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
class ProductOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  price: Number;
}

export class createOrderDto {
  @IsMongoId()
  userId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @IsString()
  status?: string;
}
