import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
            secretOrKey: configService.get('JWT_SECRET'),
            ignoreExpiration: false
        });
    }

    async validate(payload: any) {
        const expiration = new Date(payload.exp * 1000);
        if(expiration < new Date) {
            throw new HttpException('Token expired!', 401)
        }

        return { userId: payload.sub, email: payload.email };
    }
}