import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { CheckAdmin } from 'src/guards/check-Admin';
import { checkToken } from 'src/guards/check-Token';
import { GenerateOtpDto } from './Dtos/generateOtp-Dto';
import { verifiyOtpDto } from './Dtos/verfiyOtp-Dto';
import { Request } from 'express';
@Controller('otp')
export class OtpController {
  constructor(private readonly OtpService: OtpService) {}
  @UseGuards(checkToken)
  @Post('/Generate')
  async generateOtp(@Body() body: GenerateOtpDto, @Req() req: Request) {
    const user = (req as any).User;

    const otp = await this.OtpService.generateOtp(body, user);
    return { message: 'OTP generate', otp };
  }
  @UseGuards(checkToken)
  @Post('/verify')
  async verifiyOtp(@Body() body: verifiyOtpDto, @Req() req: Request) {
    const user = (req as any).User;

    await this.OtpService.verifiyOtp(body, user);
    return { message: 'OTP is verified,payment status is updated' };
  }
}
