import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { TokenPayload } from '../types';
import { Env } from 'src/common/env/env';

@Injectable()
export class ResetPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync(resetToken, {
        secret: this.configService.getOrThrow(Env.JWT_RESET_TOKEN_SECRET),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (!payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userRepository.findOne({
      where: { email: payload.email },
      select: {
        id: true,
        reset_token: true,
        reset_token_expires_at: true,
        password: true,
      },
    });

    if (
      !user ||
      user.reset_token !== resetToken ||
      !user.reset_token_expires_at ||
      user.reset_token_expires_at < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.reset_token = null;
    user.reset_token_expires_at = null;

    await this.userRepository.save(user);

    return { message: 'Password has been reset successfully' };
  }
}
