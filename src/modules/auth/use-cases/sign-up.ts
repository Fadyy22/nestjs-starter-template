import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class SignUp {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(signUpDto: SignUpDto) {
    const { email, password, full_name, username } = signUpDto;

    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.username'])
      .where('user.email = :email', { email })
      .orWhere('user.username = :username', { username })
      .getOne();

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
      username,
    });

    return newUser;
  }
}
