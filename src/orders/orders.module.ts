import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './orders.controller';

@Module({
  imports: [PrismaModule],
  providers: [OrdersService, OrdersGateway],
  controllers: [OrdersController],
})
export class OrdersModule {}
