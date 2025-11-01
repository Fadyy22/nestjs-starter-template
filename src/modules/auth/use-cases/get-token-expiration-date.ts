import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenType } from '../types/token-type';
import { Env } from 'src/common/env/env';

@Injectable()
export class GetTokenExpirationDate {
  constructor(private readonly configService: ConfigService) {}

  execute(type: TokenType): Date {
    const expirationInMs =
      type === 'access'
        ? this.configService.getOrThrow(Env.JWT_ACCESS_TOKEN_EXPIRATION_MS)
        : this.configService.getOrThrow(Env.JWT_REFRESH_TOKEN_EXPIRATION_MS);

    return new Date(Date.now() + parseInt(expirationInMs, 10));
  }
}
