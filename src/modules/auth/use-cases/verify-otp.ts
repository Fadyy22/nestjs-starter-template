import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { GenerateToken } from './generate-token';
import { Env } from 'src/common/env/env';

@Injectable()
export class VerifyOtp {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly generateToken: GenerateToken,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string, otp: string): Promise<{ reset_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        reset_otp: true,
        reset_otp_expires_at: true,
      },
    });

    if (!user || !user.reset_otp || !user.reset_otp_expires_at) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (user.reset_otp !== otp || user.reset_otp_expires_at < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.reset_otp = null;
    user.reset_otp_expires_at = null;

    const tokenPayload = {
      sub: user.id,
      email: user.email,
    };
    const resetToken = await this.generateToken.execute(tokenPayload, 'reset');

    const expirationInMs = this.configService.getOrThrow(
      Env.JWT_RESET_TOKEN_EXPIRATION_MS,
    );

    user.reset_token = resetToken;
    user.reset_token_expires_at = new Date(
      Date.now() + parseInt(expirationInMs, 10),
    );

    await this.userRepository.save(user);

    return { reset_token: resetToken };
  }
}
