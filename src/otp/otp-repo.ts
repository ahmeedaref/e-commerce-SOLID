import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpDocument } from 'src/schemas/OTPs-schema';
import { OrdersService } from 'src/orders/orders.service';
import * as moment from 'moment';
import { GenerateOtpDto } from './Dtos/generateOtp-Dto';
import { verifiyOtpDto } from './Dtos/verfiyOtp-Dto';
@Injectable()
export class OtpRepo {
  private readonly MAX_ATTEMPTS = 2;
  private readonly LOCK_TIME = 2 * 60 * 100;
  constructor(
    @InjectModel('Otp') private readonly OtpModel: Model<OtpDocument>,
    private readonly orderService: OrdersService,
  ) {}

  async generateOtp(data: GenerateOtpDto, requestUser: any): Promise<number> {
    try {
      if (!requestUser) {
        throw new UnauthorizedException('User Not authenticated');
      }

      if (requestUser.id !== data.userId && requestUser.role !== 'Admin') {
        throw new UnauthorizedException(
          'You not allowed to Verify the Otp for this order',
        );
      }
      const existingOtp = await this.OtpModel.findOne({
        orderId: data.orderId,
        isVerified: true,
      });

      if (existingOtp) {
        throw new BadRequestException(
          'Otp is already Verified , cannot generate new Otp for this order',
        );
      }
      const otp = Math.floor(1000 + Math.random() * 9999);
      await this.OtpModel.create({
        userId: data.userId,
        orderId: data.orderId,
        otp,
        isVerified: false,
        attempts: 0,
        lockUntil: null,
        createdAt: new Date(),
      });

      return otp;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyOtp(data: verifiyOtpDto, requestUser: any): Promise<boolean> {
    try {
      const { userId, orderId, otp } = data;
      if (!requestUser) {
        throw new UnauthorizedException('User Not authenticated');
      }

      if (requestUser.id !== userId && requestUser.role !== 'Admin') {
        throw new UnauthorizedException(
          'You not allowed to Verify the Otp for this order',
        );
      }
      const otpRecord = await this.OtpModel.findOne({ userId, orderId });
      if (!otpRecord) {
        throw new NotFoundException('OTP Not Found or expired');
      }

      if (
        otpRecord.lockUntil &&
        moment(otpRecord.lockUntil).isAfter(moment())
      ) {
        throw new BadRequestException(
          'too many failed attempts, try again later ',
        );
      }

      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;

        if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
          otpRecord.lockUntil = moment()
            .add(this.LOCK_TIME, 'milliseconds')
            .toDate();

          await otpRecord.save();
          throw new BadRequestException(
            'Too many failed attempts. Try again after 2 minutes.',
          );
        }
        await otpRecord.save();
        throw new BadRequestException('Invalid OTP');
      }

      otpRecord.isVerified = true;
      otpRecord.attempts = 0;
      otpRecord.lockUntil = null;
      await otpRecord.save();

      await this.orderService.updatePaymentStatment(orderId, true);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
