import { PartialType } from '@nestjs/mapped-types';
import { createProductDto } from './create-product-dtos';

export class UpdateProduct extends PartialType(createProductDto) {}
