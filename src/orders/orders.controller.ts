import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from '@prisma/client';
import { OrdersGateway } from './orders.gateway';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private ordersGateway: OrdersGateway,
  ) {}

  // Создание заказа – доступно авторизованным пользователям.
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() body: { officeId: number }) {
    const newOrder = await this.ordersService.createOrder(body.officeId);
    this.ordersGateway.server.emit('orderCreated', newOrder);
    return newOrder;
  }

  // Получение списка заказов
  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  // Обновление статуса заказа на READY
  @UseGuards(JwtAuthGuard)
  @Patch(':id/ready')
  async markOrderReady(@Param('id') id: string) {
    const updatedOrder = await this.ordersService.updateOrderStatus(
      parseInt(id, 10),
      OrderStatus.READY,
    );
    this.ordersGateway.server.emit('orderUpdated', updatedOrder);
    return updatedOrder;
  }
  // Обновление статуса заказа на CLOSED
  @UseGuards(JwtAuthGuard)
  @Patch(':id/closed')
  async markOrderClosed(@Param('id') id: string) {
    const updatedOrder = await this.ordersService.updateOrderStatus(
      parseInt(id, 10),
      OrderStatus.CLOSED,
    );
    this.ordersGateway.server.emit('orderUpdated', updatedOrder);
    return updatedOrder;
  }
}
