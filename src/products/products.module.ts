import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user-schema';
import { Product, ProductSchema } from '../schemas/products-schema';
import { ProductRepo } from './product-Repo';
import { JwtService } from '@nestjs/jwt';
import { AuthValidate } from 'src/guards/validate-Token';
import { CheckAdmin } from 'src/guards/check-Admin';
import { AuthService } from 'src/auth/auth.service';
import { UserRepo } from 'src/auth/user-repo';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.modelName, schema: ProductSchema },
      { name: User.modelName, schema: UserSchema },
    ]),
  ],
  providers: [
    ProductsService,
    ProductRepo,
    UserRepo,
    AuthService,
    JwtService,
    AuthValidate,
    CheckAdmin,
    {
      provide: 'role',
      useValue: 'Admin',
    },
  ],
  exports: ['role'],
  controllers: [ProductsController],
})
export class ProductsModule {}
