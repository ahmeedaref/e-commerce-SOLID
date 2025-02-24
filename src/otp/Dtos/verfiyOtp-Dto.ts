import { PartialType } from '@nestjs/mapped-types';
import { GenerateOtpDto } from './generateOtp-Dto';
import { IsNumber } from 'class-validator';
export class verifiyOtpDto extends PartialType(GenerateOtpDto) {
  @IsNumber()
  otp: number;
}
