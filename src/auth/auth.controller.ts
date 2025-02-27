import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from './Dtos/create-user-dto';
@Controller('auth')
export class AuthController {
  constructor(private AuthServie: AuthService) {}
  @Post('register')
  async register(@Body() body: CreateUser) {
    const user = await this.AuthServie.register(body);
    return user;
  }
  @Post('login')
  async login(@Body() body: CreateUser) {
    const user = await this.AuthServie.login(body);
    return user;
  }
  @Post('refresh')
  async refresh_Token(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh Token is required');
    }

    return this.AuthServie.ref_Token(body.refreshToken);
  }
}
