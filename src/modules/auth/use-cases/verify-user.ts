import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class VerifyUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        provider: true,
      },
    });

    if (user?.provider) {
      const capitalizedProvider =
        user.provider.charAt(0).toUpperCase() + user.provider.slice(1);
      throw new UnauthorizedException(
        `Your account is linked to a ${capitalizedProvider} account, please log in with ${capitalizedProvider} instead.`,
      );
    }

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
