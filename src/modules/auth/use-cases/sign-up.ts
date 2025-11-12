import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { SignUpDto } from '../dtos/sign-up.dto';
import { LogIn } from './log-in';

@Injectable()
export class SignUp {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logIn: LogIn,
  ) {}

  async execute(signUpDto: SignUpDto, response: Response) {
    const { email, password, full_name } = signUpDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true },
    });

    if (existingUser && existingUser.email === email) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
    });

    return this.logIn.execute(user, response);
  }
}
