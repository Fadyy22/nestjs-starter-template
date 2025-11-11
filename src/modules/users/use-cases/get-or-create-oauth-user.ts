import { Injectable } from '@nestjs/common';

import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { CreateOAuthUserDto } from '../dtos/create-oauth-user.dto';

@Injectable()
export class GetOrCreateOAuthUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createOAuthUserDto: CreateOAuthUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createOAuthUserDto.email },
      select: {
        id: true,
        email: true,
      },
    });

    if (user) {
      return user;
    }

    return this.userRepository.create(createOAuthUserDto);
  }
}
