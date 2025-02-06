import { IsNumber, IsString } from 'class-validator';
import { OrderStatus } from 'src/schemas/orders-schema';

export class getOrderDto {
  @IsNumber()
  page: number;
  @IsNumber()
  limit: number;
  @IsString()
  status?: OrderStatus;
  @IsString()
  sort: 'asc'|'desc';
}
