import { IsMongoId, IsNumber, IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @IsMongoId()
  userId: string;
  @IsMongoId()
  orderId: string;
}
