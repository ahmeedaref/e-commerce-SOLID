import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument } from 'src/schemas/orders-schema';
import { ProductDocument } from 'src/schemas/products-schema';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderStatus } from 'src/schemas/orders-schema';
import { UpadteOrder } from './Dtos/update-order-dto';
import mongoose from 'mongoose';
import { Product } from '../schemas/products-schema';

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

  async create_Order(data: createOrderDto, requestUser: any) {
    const { userId, products, status } = data;
    if (!requestUser) {
      throw new UnauthorizedException('User not Authorized');
    }
    if (requestUser.id !== userId) {
      throw new UnauthorizedException(
        'You are Not allowed to create order for this User',
      );
    }
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

  async Delete_Order(id: string, requestUser: any) {
    const order =
      await this.OrderModel.findById(id).populate('products.product');
    if (!order) {
      throw new NotFoundException('order Not Found ');
    }
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCALLED
    ) {
      throw new BadRequestException(
        'it can Not be Delete an order that Delivred or Cancalled',
      );
    }

    if (!requestUser) {
      throw new UnauthorizedException('User Not authorized');
    }

    if (
      requestUser.id !== order.userId.toString() &&
      requestUser.role !== 'Admin'
    ) {
      throw new UnauthorizedException(
        'You are not allowed to Delete other orders',
      );
    }

    for (const item of order.products) {
      const product = item.product as ProductDocument;
      product.quantity += item.quantity;
      await product.save();
    }
    await this.OrderModel.findByIdAndDelete(id);
    return 'Order deleted successfullye , and product stock has been restored';
  }

  async upadte_Order(id: string, data: UpadteOrder, requestUser: any) {
    const order =
      await this.OrderModel.findById(id).populate('products.product');
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    if (!requestUser) {
      throw new UnauthorizedException('User Not authorized');
    }
    if (
      requestUser.id !== order.userId.toString() &&
      requestUser.role !== 'Admin'
    ) {
      throw new UnauthorizedException(
        'You are not allowed to Update other orders',
      );
    }

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCALLED
    ) {
      throw new BadRequestException(
        'Can not update the order if he DElIVRED or CANALLED',
      );
    }

    if (data.status) {
      order.status = data.status;
      if (data.status === OrderStatus.CANCALLED) {
        for (const orderProduct of order.products) {
          const product = orderProduct.product as ProductDocument;
          const ProductFound = await this.productModel.findById(product._id);
          if (!ProductFound) {
            throw new NotFoundException(
              `Product with ID ${ProductFound._id} not found`,
            );
          }
          ProductFound.quantity += orderProduct.quantity;
          await ProductFound.save();
        }
      }
      await order.save();
      return {
        message: 'Order status updated and stock restored successfully',
        updatedOrder: order,
      };
    }

    if (data.products) {
      const productDetails = await this.getProductDetails(data.products);
      const totalPrice = this.calculateTotalPrice(productDetails);

      for (const item of data.products) {
        const existingProduct = order.products.find((p) => {
          const product = p.product as ProductDocument;
          return product._id.toString() === item.productId;
        });

        if (existingProduct) {
          const quantityDifference = item.quantity - existingProduct.quantity;
          const product = await this.productModel.findById(item.productId);
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }
          product.quantity -= quantityDifference;
          await product.save();
        }
      }

      order.products = productDetails.map(({ product, quantity }) => ({
        product,
        quantity,
        price: product.price,
      }));
      order.totalPrice = totalPrice;
    }
    return order.save();
  }
  async getOrdersByUserId(
    userId: string,
    requestUser: any,
  ): Promise<OrderDocument[]> {
    if (!requestUser) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (requestUser.id !== userId && requestUser.role !== 'Admin') {
      throw new UnauthorizedException(
        'You are not allowed to view these orders',
      );
    }

    const orders = await this.OrderModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate('products.product');

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }

    return orders;
  }

  async updatePaymentStatus(orderId: string, isPaid: boolean): Promise<void> {
    await this.OrderModel.findByIdAndUpdate(orderId, { pay: isPaid });
  }
}
