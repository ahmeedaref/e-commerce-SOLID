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
import { UpadteOrder } from './Dtos/update-order-dto';
import mongoose from 'mongoose';

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
          product,
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

    for (const { product, quantity } of productDetails) {
      if (product.quantity < quantity) {
        throw new BadRequestException(
          `Not enough stock for product: ${product.name}`,
        );
      }
    }

    for (const { product, quantity } of productDetails) {
      product.quantity -= quantity;
      await product.save();
    }

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

  async getOne_Order(id: string): Promise<OrderDocument> {
    const order =
      await this.OrderModel.findById(id).populate('products.product');

    if (!order) {
      throw new NotFoundException('Order Not found ');
    }
    return order;
  }

  async Delete_Order(id: string) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException('order Not Found ');
    }
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCALLED
    ) {
      throw new BadRequestException(
        'it can be Delete an order that Delivred or Cancalled',
      );
    }
    await this.OrderModel.findByIdAndDelete(id);
    return 'Deleted the Order';
  }

  async upadte_Order(id: string, data: UpadteOrder) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    if (data.status) {
      if (
        order.status === OrderStatus.DELIVERED &&
        order.status !== data.status
      ) {
        throw new BadRequestException(
          'can not move status from Delivred to another status',
        );
      }
      order.status = data.status;
      return order.save();
    }

    if (data.products) {
      if (
        order.status === OrderStatus.DELIVERED &&
        order.status !== data.status
      ) {
        throw new BadRequestException(
          'can not update the order when the status is Delivred',
        );
      }
      const { userId, products, status } = data;
      const productDetails = await this.getProductDetails(products);
      const totalprice = this.calculateTotalPrice(productDetails);
      const ord = await this.OrderModel.findByIdAndUpdate(
        id,
        {
          userId,
          products: productDetails.map(({ product, quantity }) => ({
            product,
            quantity,
          })),
          status,
          totalPrice: totalprice,
        },
        { next: true },
      )
        .populate('products.product')
        .exec();

      const updatedOrder = await this.OrderModel.findById(id)
        .populate('products.product')
        .exec();
      return updatedOrder;
    }
  }
  async getOrdersByUserId(userId: string): Promise<OrderDocument[]> {
    const orders = await this.OrderModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate('products.product');

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }

    return orders;
  }
}
