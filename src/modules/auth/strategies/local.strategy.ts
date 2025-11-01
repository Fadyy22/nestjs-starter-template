import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from 'src/modules/users/entities/user.entity';
import { VerifyUser } from '../use-cases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly verifyUser: VerifyUser) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  validate(email: string, password: string): Promise<User> {
    return this.verifyUser.execute(email, password);
  }
}
