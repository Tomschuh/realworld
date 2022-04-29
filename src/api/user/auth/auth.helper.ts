import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthHelper {
    constructor(
        private readonly jwtService: JwtService
    ) {}
    
    decodeJwtToken(token: string): unknown {
        return this.jwtService.decode(token, null);
    }

    encodeJwtToken(payload: object) : string {
        return this.jwtService.sign(payload);
    }

    async encodePassword(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
}