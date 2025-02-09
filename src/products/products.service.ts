import { Injectable } from '@nestjs/common';
import { ProductRepo } from './product-Repo';
import { createProductDto } from './Dtos/create-product-dtos';
import { UpdateProduct } from './Dtos/update-product-dtos';
@Injectable()
export class ProductsService {
  constructor(private readonly ProductRepo: ProductRepo) {}

  async createProucts(data: createProductDto) {
    return this.ProductRepo.create(data);
  }
  async findAll() {
    return this.ProductRepo.FindAll();
  }

  async findProduct(id: string) {
    return this.ProductRepo.FindOne(id);
  }

  async search_query(query: any) {
    return this.ProductRepo.search_Query(query);
  }

  async Update_product(id: string, data: UpdateProduct) {
    return this.ProductRepo.update_product(id, data);
  }

  async Delete_product(id: string) {
    return this.ProductRepo.delete_Product(id);
  }
}
