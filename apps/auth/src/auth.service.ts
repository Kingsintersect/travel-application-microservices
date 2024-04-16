import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { jwtConstants } from './constants/jwt.constants';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/signin-dto';
import { PayloadType } from './types/payload.type';
import { Users } from './users/schema/users.schema';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApplicationException } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { NOTIFICATION_SERVICE } from './constants/services';
import { UpdateUserDto } from './users/dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private readonly jwtService: JwtService, @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy) { }

    async signIn(userDto: SignInDto): Promise<{ access_token: string }> {
        const user = await this.findAUser(userDto.email);
        await this.validatePassword(userDto.password, user.password);

        const payload: PayloadType = { email: user.email, _id: user._id };
        if (user.userRole === "admin") { payload.userRole = user.userRole; }
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async changePassword(param: ChangePasswordDto, token: string) {
        const decoded = this.verifyToken(token);
        const user = await this.findAUser(decoded.email);
        const { current_password, proposed_pass } = param;

        const validPassword = await this.validatePassword(current_password, user.password, proposed_pass)
        if (validPassword) {
            console.log(validPassword)
            const salt = await bcrypt.genSalt();
            const new_pass = await bcrypt.hash(proposed_pass, salt)
            try {
                const updateUser = await this.usersService.update(decoded._id, { password: new_pass });
                // to notification microservice
                const activity = "Your password has been changed succefully..."
                await lastValueFrom(this.notificationClient.emit('user_password_changed', { updateUser, activity }));
                console.log("sending a user created event to abbitMQ");
                return updateUser;
            } catch (err) {
                throw err;
            }
        }
    }

    async resetPassword(_id, expire_time, passwordDto: UpdateUserDto) {
        try {
            const decodedUderIdData = Buffer.from(_id, 'base64').toString('ascii');
            const decodedTimeData = new Date(Buffer.from(expire_time, 'base64').toString('ascii'));
            const isExpired = this.checkTimeExpiration(decodedTimeData);
            if (!isExpired) throw new ApplicationException("Your Token Valid Time Has Expired!");
            const salt = await bcrypt.genSalt();
            passwordDto.password = await bcrypt.hash(passwordDto.password, salt);
            return await this.usersService.update(decodedUderIdData, passwordDto);
        } catch (error) {
            throw error;
        }
    }

    checkTimeExpiration(time: Date): boolean {
        const currentTime = Date.now();
        const tokenExpirationTime = new Date(time).getTime();
        if (currentTime > tokenExpirationTime) {
            return false; // Token has expired
        } else {
            return true;
        }
    }


    async validatePassword(provided_password: string, user_password: string, proposed_pass: string | undefined = undefined): Promise<boolean | HttpException> {
        let result: boolean = false;
        try {
            const passwordMatch = await bcrypt.compare(provided_password, user_password);
            if (!passwordMatch) {
                throw new UnauthorizedException('Invalid Credentials!');
            } else {
                result = true;
            }

            if (proposed_pass) {
                if (proposed_pass.length < 8) {
                    throw new ApplicationException("Password must be 8 characters or more!");
                }
                if (!this.passwordMatchValidCharaters(proposed_pass)) {
                    throw new ApplicationException("Password must contain both alphabets and numbers!");
                }
            }

            // Return a value if needed
            return result;
        } catch (error) {
            // Handle any errors here or rethrow them if necessary
            throw error;
        }
    }

    passwordMatchValidCharaters(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        return regex.test(password);
    }

    async findAUser(param): Promise<Users | null> {
        const user = await this.usersService.findOne(param) as unknown as Users
        return (user) ? user : null;
    }





    verifyToken(token: string) {
        return this.jwtService.verify(token, { secret: jwtConstants.secret });
    }

    async validate(email: string, password: string): Promise<Users | null> {
        const user = await this.findAUser(email);

        if (!user) {
            return null
        }
        const passwordIsValid = password === user.password;
        return passwordIsValid ? user : null;
    }

    async verify(token: string): Promise<Users> {
        // const decoded = this.jwtService.verify(token, {
        //     secret: jwtConstants.secret
        // });
        const decoded = this.verifyToken(token)

        const user = await this.findAUser(decoded.email);
        if (!user) throw Error("Unable to get the user from decoded token");
        return user;
    }
}
