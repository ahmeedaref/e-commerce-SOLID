import { IsString, IsNumber, IsMongoId } from 'class-validator';
export class createProductDto {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsNumber()
  quantity: number;
  @IsString()
  category?: string;
  @IsString()
  description?: string;
  @IsMongoId()
  CreatedBy: string;
}
