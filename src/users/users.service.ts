import { Injectable } from '@nestjs/common';
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@test.com',
      username: 'john',
      password: 'changeme',
      twoFactorAuthenticationSecret: null,
      isTwoFactorAuthenticationEnabled: false,
    },
    {
      userId: 2,
      email: 'maria@test.com',
      username: 'maria',
      password: 'guess',
      twoFactorAuthenticationSecret: null,
      isTwoFactorAuthenticationEnabled: false,
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    this.users.find(user => user.userId === userId).twoFactorAuthenticationSecret = secret;
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    this.users.find(user => user.userId === userId).isTwoFactorAuthenticationEnabled = true;
  }
}
