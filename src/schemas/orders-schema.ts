import { Document, Schema, model, Types } from 'mongoose';
import { UserDocument } from './user-schema';
import { ProductDocument } from './products-schema';

export interface OrderDocument extends Document {
  userId: UserDocument;
  products: {
    product: ProductDocument['_id'];
    quantity: number;
    price: number;
  }[];
  status: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONfIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCALLED = 'CANCALLED',
}

const ProductSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number },
  },
  { _id: false },
);

export const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [ProductSchema] },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    totalPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

OrderSchema.pre('save', async function (next) {
  const order = this as OrderDocument;
  await order.populate('products.product');

  order.totalPrice = order.products.reduce((sum, item: any) => {
    const productPrice = item.product.price;
    return sum + productPrice * item.qantity;
  }, 0);
  next();
});

export const Order = model<OrderDocument>('Order', OrderSchema);
