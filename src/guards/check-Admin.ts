import {
  Injectable,
  Inject,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { AuthValidate } from './validate-Token';
import { Observable } from 'rxjs';

@Injectable()
export class CheckAdmin implements CanActivate {
  constructor(
    @Inject('role') private readonly roles: string[],
    private authVlaidate: AuthValidate,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    const decode = this.authVlaidate.ValidateToken(token);
    const role = decode.role;
    if (role !== 'Admin') {
      throw new UnauthorizedException('Access denied, your role should be Admin ');
    }
    return true;
  }
}
