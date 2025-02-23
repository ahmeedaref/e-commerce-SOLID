import { Injectable } from '@nestjs/common';
import { UserRepo } from './user-repo';
import { CreateUser } from './Dtos/create-user-dto';
@Injectable()
export class AuthService {
  constructor(private readonly UserRepo: UserRepo) {}

  async register(data: CreateUser) {
    return this.UserRepo.createUsers(data);
  }

  async login(data: CreateUser) {
    return this.UserRepo.CheckUser(data);
  }

  async ref_Token(refresh: string) {
    return this.UserRepo.refresh_Token(refresh);
  }
}
