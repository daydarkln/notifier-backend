import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FloorModule } from './floor/floor.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersService } from './orders/orders.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule, AuthModule, OrdersModule, UsersModule, FloorModule],
  providers: [PrismaService, OrdersService],
})
export class AppModule {}
