import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { Env } from 'src/common/env/env';
import { LoggedInUser, TokenPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.AccessToken;
        },
      ]),
      secretOrKey: configService.getOrThrow(Env.JWT_ACCESS_TOKEN_SECRET),
    });
  }

  validate(payload: TokenPayload): LoggedInUser {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
