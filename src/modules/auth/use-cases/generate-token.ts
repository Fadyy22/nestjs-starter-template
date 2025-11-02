import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenType } from '../types';
import { Env } from 'src/common/env/env';

@Injectable()
export class GenerateToken {
  private readonly tokenData: Record<
    TokenType,
    { secret: string; expiration: string }
  > = {
    access: {
      secret: Env.JWT_ACCESS_TOKEN_SECRET,
      expiration: Env.JWT_ACCESS_TOKEN_EXPIRATION_MS,
    },
    refresh: {
      secret: Env.JWT_REFRESH_TOKEN_SECRET,
      expiration: Env.JWT_REFRESH_TOKEN_EXPIRATION_MS,
    },
    reset: {
      secret: Env.JWT_RESET_TOKEN_SECRET,
      expiration: Env.JWT_RESET_TOKEN_EXPIRATION_MS,
    },
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  execute(payload: Record<string, any>, type: TokenType): Promise<string> {
    const secretKey = this.configService.getOrThrow(
      this.tokenData[type].secret,
    );
    const expirationKey = this.configService.getOrThrow(
      this.tokenData[type].expiration,
    );

    return this.jwtService.signAsync(payload, {
      secret: secretKey,
      expiresIn: `${expirationKey}ms`,
    });
  }
}
