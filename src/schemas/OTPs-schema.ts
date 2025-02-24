import { Document, Schema, model } from 'mongoose';
import { UserDocument } from './user-schema';
import { OrderDocument } from './orders-schema';
export interface OtpDocument extends Document {
  userId: UserDocument['_id'];
  orderId: OrderDocument['_id'];
  otp: number;
  isVerified: boolean;
  attempts: number;
  lockUntil: Date | null;
  createdAt: Date;
}

export const OtpSchema = new Schema<OtpDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    otp: { type: Number, required: true },
    isVerified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, expires: 300 },
  },
  { timestamps: true },
);

export const Otp = model<OtpDocument>('Otp', OtpSchema);
