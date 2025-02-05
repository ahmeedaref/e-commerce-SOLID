import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthValidate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  ValidateToken(Token: string) {
    try {
      const secretKey = this.configService.get<string>('ACCESSTOKEN');
      if (!secretKey) {
        throw new UnauthorizedException(
          'No secret key found for token verification',
        );
      }

      const accessToken = this.jwtService.verify(Token, { secret: secretKey });

      return accessToken;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
