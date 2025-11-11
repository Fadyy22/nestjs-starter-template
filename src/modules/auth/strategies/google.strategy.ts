import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { Env } from 'src/common/env/env';
import { CreateOAuthUserDto } from '../../users/dtos/create-oauth-user.dto';
import { GetOrCreateOAuthUser } from '../../users/use-cases/get-or-create-oauth-user';
import { AuthProvider } from '../enums/auth-provider';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly getOrCreateOAuthUser: GetOrCreateOAuthUser,
  ) {
    super({
      clientID: configService.getOrThrow(Env.GOOGLE_WEB_CLIENT_ID),
      clientSecret: configService.getOrThrow(Env.GOOGLE_WEB_CLIENT_SECRET),
      callbackURL: configService.getOrThrow(Env.GOOGLE_WEB_CALLBACK_URL),
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const createOAuthUserDto: CreateOAuthUserDto = {
      email: profile.emails?.[0]?.value as string,
      full_name: profile.displayName,
      provider: AuthProvider.GOOGLE,
    };

    return this.getOrCreateOAuthUser.execute(createOAuthUserDto);
  }
}
