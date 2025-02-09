import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createProductDto } from './Dtos/create-product-dtos';
import { UpdateProduct } from './Dtos/update-product-dtos';
import { ProductDocument } from 'src/schemas/products-schema';
import { UserDocument } from 'src/schemas/user-schema';
@Injectable()
export class ProductRepo {
  constructor(
    @InjectModel('Product')
    private readonly ProductModel: Model<ProductDocument>,
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
  ) {}

  async create(data: createProductDto) {
    const user = await this.UserModel.findById(data.CreatedBy);
    if (!user) {
      return new NotFoundException('User Not Found');
    }
    const { name } = data;
    const product = await this.ProductModel.findOne({ name });
    if (product) {
      return new BadRequestException('the product name is already exsits');
    }

    const Prod = new this.ProductModel(data);
    await Prod.save();
    return this.ProductModel.findById(Prod._id).populate('CreatedBy').exec();
  }

  async FindAll(): Promise<ProductDocument[]> {
    return this.ProductModel.find().populate('CreatedBy').exec();
  }

  async FindOne(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product) {
      return new NotFoundException('Product Not Found');
    }
    return this.ProductModel.findById(id).populate('CreatedBy').exec();
  }

  async search_Query(query: any): Promise<ProductDocument[]> {
    const filters: any = {};

    if (query.name) {
      filters.name = { $regex: query.name, $options: 'i' };
    }
    if (query.category) {
      filters.category = query.category;
    }

    if (query.price) {
      filters.price = JSON.parse(query.price);
    }
    return this.ProductModel.find(filters).populate('CreatedBy').exec();
  }

  async update_product(id: string, data: UpdateProduct) {
    const product = await this.ProductModel.findByIdAndUpdate(
      { _id: id },
      data,
      { next: true },
    );
    if (!product) {
      return new NotFoundException('product Not found');
    }
    return (await this.ProductModel.findById(id)).populate('CreatedBy');
  }

  async delete_Product(id: string) {
    const product = await this.ProductModel.findByIdAndDelete(id);
    if (!product) {
      return new NotFoundException('Product Not Found to Delete');
    }
    return 'Deleted product Successfully';
  }
}
