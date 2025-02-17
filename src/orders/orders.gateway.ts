import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

@WebSocketGateway(80, { cors: true })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  constructor(private ordersService: OrdersService) {}

  // Уведомление о создании нового заказа
  @SubscribeMessage('newOrder')
  async handleNewOrder(
    @MessageBody() data: { officeId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const newOrder = await this.ordersService.createOrder(data.officeId);
    this.server.emit('orderCreated', newOrder);
    return newOrder;
  }

  // Уведомление об обновлении статуса заказа
  @SubscribeMessage('markOrderReady')
  async handleMarkOrderReady(
    @MessageBody() data: { orderId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const updatedOrder = await this.ordersService.updateOrderStatus(
      data.orderId,
      OrderStatus.READY,
    );
    this.server.emit('orderUpdated', updatedOrder);
    return updatedOrder;
  }
}
