import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { GetOrCreateOAuthUser } from './use-cases/get-or-create-oauth-user';
import { GetMe } from './use-cases/get-me';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserRepository, GetOrCreateOAuthUser, GetMe],
  exports: [UserRepository, GetOrCreateOAuthUser],
})
export class UsersModule {}
