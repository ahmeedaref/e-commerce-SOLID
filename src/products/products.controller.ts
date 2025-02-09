import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { createProductDto } from './Dtos/create-product-dtos';
import { UpdateProduct } from './Dtos/update-product-dtos';
import { AuthValidate } from 'src/guards/validate-Token';
import { CheckAdmin } from 'src/guards/check-Admin';
import { checkToken } from 'src/guards/check-Token';
import { ProductDocument } from 'src/schemas/products-schema';
@Controller('products')
export class ProductsController {
  constructor(private Productservice: ProductsService) {}
  @UseGuards(AuthValidate, CheckAdmin)
  @Post()
  async crateProducts(@Body() body: createProductDto) {
    const product = this.Productservice.createProucts(body);
    return product;
  }
  @UseGuards(checkToken)
  @Get()
  async findProducts() {
    const product = this.Productservice.findAll();
    return product;
  }
  @UseGuards(checkToken)
  @Get('search')
  async findBy_Query(@Query() query: any): Promise<ProductDocument[]> {
    return this.Productservice.search_query(query);
  }
  @UseGuards(checkToken)
  @Get('/:id')
  async findOneProduct(@Param('id') id: string) {
    const product = this.Productservice.findProduct(id);
    return product;
  }

  @UseGuards(AuthValidate, CheckAdmin)
  @Patch('/:id')
  async Update_Product(@Param('id') id: string, @Body() body: UpdateProduct) {
    const product = this.Productservice.Update_product(id, body);
    return product;
  }
  @UseGuards(AuthValidate, CheckAdmin)
  @Delete('/:id')
  async Delete_Product(@Param('id') id: string) {
    const product = this.Productservice.Delete_product(id);
    return product;
  }
}
