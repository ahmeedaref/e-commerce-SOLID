import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    ProductsModule,
    OrdersModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL ||
        'mongodb+srv://ahmedaref127:ahmeed1902@backenddb.1rq3a.mongodb.net/attempt?retryWrites=true&w=majority&appName=BackendDB',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
