import { IsString, IsEmail } from 'class-validator';

export class CreateUser {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  role?: string;
}
