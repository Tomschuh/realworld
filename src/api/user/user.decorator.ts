import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestData } from '@shared/request.include.user';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req : Request = ctx.switchToHttp().getRequest();
    if (req && req.user) {
      const user : UserRequestData = req.user as UserRequestData;
      return !!data ? user[data as keyof UserRequestData] : user;
    }
  }
);
