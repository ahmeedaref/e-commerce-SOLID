import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderStatus } from 'src/schemas/orders-schema';
@Controller('orders')
export class OrdersController {
  constructor(private OrderService: OrdersService) {}
  @Post()
  async createOrder(@Body() body: createOrderDto) {
    const order = this.OrderService.createOrder(body);
    return order;
  }
  @Get()
  async getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: OrderStatus,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ) {
    return this.OrderService.findALL_Orders({ page, limit, status, sort });
  }
}
