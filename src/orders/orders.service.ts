import { Injectable } from '@nestjs/common';
import { OrderRepo } from './Order-Repo';
import { createOrderDto } from './Dtos/create-order-dto';
import { getOrderDto } from './Dtos/getAll-orders-dtos';
import { UpadteOrder } from './Dtos/update-order-dto';

@Injectable()
export class OrdersService {
  constructor(private OrderRepo: OrderRepo) {}

  async createOrder(data: createOrderDto, requestUser: any) {
    return this.OrderRepo.create_Order(data, requestUser);
  }

  async findALL_Orders(data: getOrderDto) {
    const { page, limit, status, sort } = data;
    return this.OrderRepo.findAll({ page, limit, status, sort });
  }

  async findOne_Order(id: string) {
    return this.OrderRepo.getOne_Order(id);
  }

  async Delete_order(id: string, requestUser: any) {
    return this.OrderRepo.Delete_Order(id, requestUser);
  }
  async update_order(id: string, data: UpadteOrder, requestUser: any) {
    return this.OrderRepo.upadte_Order(id, data, requestUser);
  }

  async getUserOrder(userId: string, requestUser: any) {
    return this.OrderRepo.getOrdersByUserId(userId, requestUser);
  }

  async updatePaymentStatment(orderId: string, isPaid: boolean) {
    return this.OrderRepo.updatePaymentStatus(orderId, isPaid);
  }
}
