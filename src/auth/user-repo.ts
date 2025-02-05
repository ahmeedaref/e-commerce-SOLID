import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/schemas/user-schema';
import { CreateUser } from './Dtos/create-user-dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserRepo {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
    private jwtservice: JwtService,
    private configService: ConfigService,
  ) {}

  async createUsers(data: CreateUser) {
    try {
      const { email } = data;
      const user = await this.UserModel.findOne({ email });
      if (user) {
        return new BadRequestException('Email is exists');
      }
      const PasswordHashed = await bcrypt.hash(data.password, 10);
      data.password = PasswordHashed;
      const User = new this.UserModel(data);
      return User.save();
    } catch (err) {
      return new BadRequestException(err);
    }
  }

  async CheckUser(data: CreateUser) {
    const { email } = data;
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      return new NotFoundException('User Not Found');
    }
    const comparePassword = await bcrypt.compare(data.password, user.password);
    if (!comparePassword) {
      return new BadRequestException('Wrong password');
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accesstoken = this.jwtservice.sign(payload, {
      secret: this.configService.get<string>('ACCESSTOKEN'),
      expiresIn: this.configService.get<string>('EXPIRESIN'),
    });

    return { message: 'Logged Successfully', accesstoken };
  }
}
