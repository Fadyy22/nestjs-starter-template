import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { TokenPayload } from '../types/token-payload';
import { Env } from 'src/common/env/env';

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

  validate(payload: TokenPayload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
