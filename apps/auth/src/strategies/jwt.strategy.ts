import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from "../constants/jwt.constants";
import { UsersService } from "../users/users.service";
import { PayloadType } from "../types/payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        })
    }

    async validate(payload: PayloadType) {
        return { _id: payload._id, email: payload.email, userRole: payload.userRole };
    }
}