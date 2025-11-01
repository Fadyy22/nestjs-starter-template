import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class RequestOtp {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      user.reset_otp = otp;
      user.reset_otp_expires_at = expiresAt;

      await this.userRepository.save(user);

      // TODO: Send OTP to email

      return { message: 'OTP sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to request OTP',
        error.message,
      );
    }
  }
}
