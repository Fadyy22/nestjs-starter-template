import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class SignUp {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(signUpDto: SignUpDto) {
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

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
    });

    return newUser;
  }
}
