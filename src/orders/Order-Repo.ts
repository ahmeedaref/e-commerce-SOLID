import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument } from 'src/schemas/orders-schema';
import { ProductDocument } from 'src/schemas/products-schema';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderStatus } from 'src/schemas/orders-schema';
@Injectable()
export class OrderRepo {
  constructor(
    @InjectModel('Order') private readonly OrderModel: Model<OrderDocument>,
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  private async getProductDetails(
    products: { productId: string; quantity: number }[],
  ) {
    return Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await this.productModel.findById(productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        return {
          product: product._id,
          quantity,
          price: product.price,
        };
      }),
    );
  }

  private calculateTotalPrice(
    productDetalis: {
      price: number;
      quantity: number;
    }[],
  ) {
    return productDetalis.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  async create_Order(data: createOrderDto) {
    const { userId, products, status } = data;
    const productDetails = await this.getProductDetails(products);
    const totalPrice = this.calculateTotalPrice(productDetails);
    const order = new this.OrderModel({
      userId,
      products: productDetails.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
      status,
      totalPrice,
    });
    return await order.save();
  }

  async findAll({
    page,
    limit,
    status,
    sort,
  }: {
    page: number;
    limit: number;
    status?: OrderStatus;
    sort: 'asc' | 'desc';
  }): Promise<OrderDocument[]> {
    const query = this.OrderModel.find();
    if (status) {
      query.where('status').equals(status);
    }
    const orders = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createAt: sort === 'asc' ? 1 : -1 })
      .populate('products.product')
      .exec();
    return orders;
  }
}
