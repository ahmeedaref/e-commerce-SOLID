import { Document, Schema, model, Types } from 'mongoose';
import { UserDocument } from './user-schema';

export interface ProductDocument extends Document {
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  CreatedBy: UserDocument;
}
export const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, uniqe: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Product = model<ProductDocument>('Product', ProductSchema);
