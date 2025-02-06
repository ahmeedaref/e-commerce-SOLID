import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/orders-schema';
import { Product, ProductSchema } from 'src/schemas/products-schema';
import { User, UserSchema } from 'src/schemas/user-schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthValidate } from 'src/guards/validate-Token';
import { CheckAdmin } from 'src/guards/check-Admin';
import { checkToken } from 'src/guards/check-Token';
import { UserRepo } from 'src/auth/user-repo';
import { OrderRepo } from './Order-Repo';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.modelName, schema: OrderSchema },
      { name: Product.modelName, schema: ProductSchema },
      { name: User.modelName, schema: UserSchema },
    ]),
  ],
  providers: [
    OrdersService,
    OrderRepo,
    AuthService,
    UserRepo,
    JwtService,
    AuthValidate,
    checkToken,
    CheckAdmin,
    { provide: 'role', useValue: 'Admin' },
  ],
  exports: ['role'],
  controllers: [OrdersController],
})
export class OrdersModule {}
