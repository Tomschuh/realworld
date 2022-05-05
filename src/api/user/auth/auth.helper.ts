import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthHelper {
  constructor(private readonly configService: ConfigService) {}

  decodeJwtToken(token: string): unknown {
    return jwt.decode(token, null);
  }

  encodeJwtToken(payload: object): string {
    return jwt.sign(
      {
        data: payload,
      },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      }
    );
  }

  async encodePassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }  
}
