import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2-client-password';
import { AuthService } from '../auth.service';
import { Users } from '../users/schema/users.schema';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<Users> {
        const user = await this.authService.validate(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
