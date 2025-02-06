import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
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
  @Get('/:id')
  async getOne_Order(@Param('id') id: string) {
    const order = this.OrderService.findOne_Order(id);
    return order;
  }
  @Delete('/:id')
  async Delete_Order(@Param('id') id: string) {
    const order = this.OrderService.Delete_order(id);
    return order;
  }
}
