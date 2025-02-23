import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './Dtos/create-order-dto';
import { OrderStatus } from 'src/schemas/orders-schema';
import { UpadteOrder } from './Dtos/update-order-dto';
import { CheckAdmin } from 'src/guards/check-Admin';
import { checkToken } from 'src/guards/check-Token';
import { Request } from 'express';
import mongoose from 'mongoose';
@Controller('orders')
export class OrdersController {
  constructor(private OrderService: OrdersService) {}
  @UseGuards(checkToken)
  @Post()
  async createOrder(@Body() body: createOrderDto) {
    const order = this.OrderService.createOrder(body);
    return order;
  }
  @UseGuards(CheckAdmin)
  @Get()
  async getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: OrderStatus,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ) {
    return this.OrderService.findALL_Orders({ page, limit, status, sort });
  }

  @Get('my-orders/:userId')
  @UseGuards(checkToken)
  async getUserOrders(@Param('userId') userId: string) {
    return this.OrderService.getUserOrder(userId);
  }
  @UseGuards(checkToken)
  @Get('/:id')
  async getOne_Order(@Param('id') id: string) {
    const order = this.OrderService.findOne_Order(id);
    return order;
  }
  @UseGuards(CheckAdmin)
  @Delete('/:id')
  async Delete_Order(@Param('id') id: string) {
    const order = this.OrderService.Delete_order(id);
    return order;
  }
  @UseGuards(checkToken)
  @Patch('/:id')
  async Update_Order(@Param('id') id: string, @Body() body: UpadteOrder) {
    const order = this.OrderService.update_order(id, body);
    return order;
  }
}
