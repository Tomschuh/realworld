import { PassportStrategy } from "@nestjs/passport"
import { authConstants } from "src/common/constants";
import { ExtractJwt, Strategy } from "passport-jwt"

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: authConstants.secret,
            ignoreExpiration: false
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}