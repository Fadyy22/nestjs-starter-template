import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { Public } from './decorators/public.decorator';
import { LocalAuthGuard, JwtRefreshAuthGuard, GoogleAuthGuard } from './guards';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  LogIn,
  RequestOtp,
  VerifyOtp,
  ResetPassword,
  SignUp,
} from './use-cases';
import {
  RequestOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
  SignUpDto,
  LogInDto,
} from './dtos';
import { ApiBody } from '@nestjs/swagger';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logInUseCase: LogIn,
    private readonly signUpUseCase: SignUp,
    private readonly requestOtpUseCase: RequestOtp,
    private readonly verifyOtpUseCase: VerifyOtp,
    private readonly resetPasswordUseCase: ResetPassword,
  ) {}

  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.signUpUseCase.execute(body);
  }

  @Post('log-in')
  @ApiBody({ type: LogInDto })
  @UseGuards(LocalAuthGuard)
  logIn(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.logInUseCase.execute(user, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.logInUseCase.execute(user, response);
  }

  @Post('request-otp')
  requestOTP(@Body() body: RequestOtpDto) {
    return this.requestOtpUseCase.execute(body.email);
  }

  @Post('verify-otp')
  verifyOTP(@Body() body: VerifyOtpDto) {
    return this.verifyOtpUseCase.execute(body.email, body.otp);
  }

  @Patch('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(body.resetToken, body.newPassword);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.logInUseCase.execute(user, response, true);
  }
}
