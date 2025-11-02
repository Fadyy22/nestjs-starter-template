import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { GenerateToken } from './generate-token';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { TokenPayload } from '../types/token-payload';
import { GetTokenExpirationDate } from './get-token-expiration-date';
import { Env } from 'src/common/env/env';

@Injectable()
export class LogIn {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly generateToken: GenerateToken,
    private readonly getTokenExpirationDate: GetTokenExpirationDate,
    private readonly configService: ConfigService,
  ) {}

  async execute(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.generateToken.execute(
      tokenPayload,
      'access',
    );
    const refreshToken = await this.generateToken.execute(
      tokenPayload,
      'refresh',
    );

    const expiresAccessToken = this.getTokenExpirationDate.execute('access');
    const expiresRefreshToken = this.getTokenExpirationDate.execute('refresh');

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(
      { id: user.id },
      { refresh_token: hashedRefreshToken },
    );

    const isProduction = this.configService.get(Env.NODE_ENV) === 'production';

    response.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: expiresAccessToken,
    });

    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: expiresRefreshToken,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
