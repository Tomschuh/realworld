import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const token = req.headers.authorization
    ? (req.headers.authorization as string).split(' ')
    : null;
  if (token && token[1]) {
    try {
      const decoded: any = jwt.verify(token[1], 'secret');
      return !!data ? decoded.data[data] : decoded.data.user;
    } catch (e) {
      console.log(e);
    }
  }
});
