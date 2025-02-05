import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user-schema';
import { UserRepo } from './user-repo';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.modelName, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESSTOKEN'),
        signOptions: { expiresIn: '1w' },
      }),
    }),
  ],
  providers: [AuthService, UserRepo],
  controllers: [AuthController],
})
export class AuthModule {}
