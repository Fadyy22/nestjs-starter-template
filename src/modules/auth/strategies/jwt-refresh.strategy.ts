import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { TokenPayload } from '../types/token-payload';
import { VerifyUserRefreshToken } from '../use-cases';
import { Env } from 'src/common/env/env';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly verifyUserRefreshToken: VerifyUserRefreshToken,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.RefreshToken,
      ]),
      secretOrKey: configService.getOrThrow(Env.JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: TokenPayload) {
    return this.verifyUserRefreshToken.execute(
      request.cookies?.RefreshToken,
      payload.sub,
    );
  }
}
