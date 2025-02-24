import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { User, UserSchema } from 'src/schemas/user-schema';
import { Order, OrderSchema } from 'src/schemas/orders-schema';
import { Otp, OtpSchema } from 'src/schemas/OTPs-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpRepo } from './otp-repo';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthValidate } from 'src/guards/validate-Token';
import { CheckAdmin } from 'src/guards/check-Admin';
import { checkToken } from 'src/guards/check-Token';
import { UserRepo } from 'src/auth/user-repo';
import { OrdersService } from 'src/orders/orders.service';
import { OrderRepo } from 'src/orders/Order-Repo';
import { Product, ProductSchema } from '../schemas/products-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.modelName, schema: OtpSchema },
      { name: User.modelName, schema: UserSchema },
      { name: Order.modelName, schema: OrderSchema },
      { name: Product.modelName, schema: ProductSchema },
    ]),
  ],
  controllers: [OtpController],
  providers: [
    OtpService,
    OtpRepo,
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
})
export class OtpModule {}
