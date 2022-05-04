import { PassportStrategy } from "@nestjs/passport"
import { authConstants } from "@common/constants";
import { ExtractJwt, Strategy } from "passport-jwt"

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
            secretOrKey: authConstants.secret,
            ignoreExpiration: false
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}