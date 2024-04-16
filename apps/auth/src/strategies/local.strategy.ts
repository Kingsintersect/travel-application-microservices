import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { Users } from "../users/schema/users.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authSevice: AuthService) {
        super({ userNameField: 'email' })
    }

    async validate(email: string, password: string): Promise<Users> {
        const user = await this.authSevice.validate(email, password)

        if (!user) throw new UnauthorizedException();
        return user;
    }
}