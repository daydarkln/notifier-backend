import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

export interface OrderDto {
  id: number;
  status: OrderStatus;
  officeId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(officeId: number) {
    return this.prisma.order.create({
      data: {
        officeId,
        status: OrderStatus.PREPARING,
      },
    });
  }

  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        office: true,
      },
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
