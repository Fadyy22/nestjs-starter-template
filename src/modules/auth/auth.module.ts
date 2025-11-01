import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import {
  LogIn,
  RequestOtp,
  VerifyOtp,
  ResetPassword,
  GenerateToken,
  GetTokenExpirationDate,
  VerifyUser,
  VerifyUserRefreshToken,
  SignUp,
} from './use-cases';
import { LocalStrategy, JwtStrategy, JwtRefreshStrategy } from './strategies';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [
    LogIn,
    SignUp,
    RequestOtp,
    VerifyOtp,
    VerifyUser,
    VerifyUserRefreshToken,
    ResetPassword,
    GenerateToken,
    GetTokenExpirationDate,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
