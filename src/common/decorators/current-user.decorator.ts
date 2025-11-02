import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { LoggedInUser } from 'src/modules/auth/types';

export const CurrentUser = createParamDecorator(
  (data: keyof LoggedInUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as LoggedInUser | undefined;

    return data ? user?.[data] : user;
  },
);
