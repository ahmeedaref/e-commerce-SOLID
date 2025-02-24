import { Injectable } from '@nestjs/common';
import { OtpRepo } from './otp-repo';
import { GenerateOtpDto } from './Dtos/generateOtp-Dto';
import { verifiyOtpDto } from './Dtos/verfiyOtp-Dto';
@Injectable()
export class OtpService {
  constructor(private readonly otpRepo: OtpRepo) {}

  async generateOtp(data: GenerateOtpDto, requestUser: any): Promise<number> {
    return this.otpRepo.generateOtp(data, requestUser);
  }

  async verifiyOtp(data: verifiyOtpDto, requestUser: any): Promise<boolean> {
    return this.otpRepo.verifyOtp(data, requestUser);
  }
}
