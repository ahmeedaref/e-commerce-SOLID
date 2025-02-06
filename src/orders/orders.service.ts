import { Injectable } from '@nestjs/common';
import { OrderRepo } from './Order-Repo';
import { createOrderDto } from './Dtos/create-order-dto';
import { getOrderDto } from './Dtos/getAll-orders-dtos';

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
}
