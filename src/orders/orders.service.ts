import { Injectable } from '@nestjs/common';
import { OrderRepo } from './Order-Repo';
import { createOrderDto } from './Dtos/create-order-dto';
import { getOrderDto } from './Dtos/getAll-orders-dtos';
import { UpadteOrder } from './Dtos/update-order-dto';

@Injectable()
export class OrdersService {
  constructor(private OrderRepo: OrderRepo) {}

  async createOrder(data: createOrderDto) {
    return this.OrderRepo.create_Order(data);
  }

  async findALL_Orders(data: getOrderDto) {
    const { page, limit, status, sort } = data;
    return this.OrderRepo.findAll({ page, limit, status, sort });
  }

  async findOne_Order(id: string) {
    return this.OrderRepo.getOne_Order(id);
  }

  async Delete_order(id: string) {
    return this.OrderRepo.Delete_Order(id);
  }
  async update_order(id: string, data: UpadteOrder) {
    return this.OrderRepo.upadte_Order(id, data);
  }

  async getUserOrder(userId: string, requestUser: any) {
    return this.OrderRepo.getOrdersByUserId(userId, requestUser);
  }
}
