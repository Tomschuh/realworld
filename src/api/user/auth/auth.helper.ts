import { Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthHelper {
    
    decodeJwtToken(token: string): unknown {
        return jwt.decode(token, null);
    }

    encodeJwtToken(payload: object) : string {
        return jwt.sign(payload);
    }

    async encodePassword(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
}