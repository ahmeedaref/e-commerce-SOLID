import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { AuthValidate } from './validate-Token';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class checkToken implements CanActivate {
  constructor(private authValidate: AuthValidate) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      User?: any;
    };
    const token = request.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('Token Not found');
    }
    try {
      const decode = this.authValidate.ValidateToken(token);
      request.User = decode;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
