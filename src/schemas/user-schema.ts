import { Document, Schema, model } from 'mongoose';
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}
export enum RoleUser {
  Admin = 'Admin',
  User = 'User',
}

export const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(RoleUser), default: RoleUser.User },
});

export const User = model<UserDocument>('User', UserSchema);
