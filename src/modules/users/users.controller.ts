import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetMe } from './use-cases/get-me';

@Controller('users')
export class UsersController {
  constructor(private readonly getMeUseCase: GetMe) {}

  @Get('me')
  async getMe(@CurrentUser('id') id: string) {
    return this.getMeUseCase.execute(id);
  }
}
