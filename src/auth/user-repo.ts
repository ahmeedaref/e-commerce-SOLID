import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
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
        throw new BadRequestException('Email is exists');
      }
      const PasswordHashed = await bcrypt.hash(data.password, 10);
      data.password = PasswordHashed;
      const User = new this.UserModel(data);
      return User.save();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async CheckUser(data: CreateUser) {
    const { email } = data;
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const comparePassword = await bcrypt.compare(data.password, user.password);
    if (!comparePassword) {
      throw new BadRequestException('Wrong password');
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

    const refreshtoken = this.jwtservice.sign(payload, {
      secret: this.configService.get<string>('REFRESHTOKEN'),
      expiresIn: '30m',
    });

    return { message: 'Logged Successfully', accesstoken, refreshtoken };
  }

  async refresh_Token(refresh: string) {
    try {
      const decode = this.jwtservice.verify(refresh, {
        secret: this.configService.get<string>('REFRESHTOKEN'),
      });
      const payload = {
        id: decode.id,
        name: decode.name,
        email: decode.email,
        role: decode.role,
      };

      const newAcessToken = this.jwtservice.sign(payload, {
        secret: this.configService.get<string>('ACCESSTOKEN'),
        expiresIn: this.configService.get<string>('EXPIRESIN'),
      });

      return { accessToken: newAcessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or Expired refresh Token');
    }
  }
}
