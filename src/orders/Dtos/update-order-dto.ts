import { PartialType } from '@nestjs/mapped-types';
import { createOrderDto } from './create-order-dto';
export class UpadteOrder extends PartialType(createOrderDto) {}
