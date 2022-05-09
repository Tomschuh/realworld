import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { CustomJwtPayload } from './jwt.token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      try {
        const token = (authHeaders as string).split(' ')[1];
        const decode : CustomJwtPayload = jwt.verify(token, this.configService.get('JWT_SECRET')) as CustomJwtPayload;
        const user = await this.authService.getUserRequestData(decode.data.userId);

        req.user = user;
        next();
        return;
      } catch (error) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
    }
    next(); 
  }
}
