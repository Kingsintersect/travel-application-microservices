import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApplicationException } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetRepository } from './reset-password.repository';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '../constants/services';

@Injectable()
export class ResetPasswordService {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly resetRepo: PasswordResetRepository, @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy) { }

    async create(passwordDto: ResetPasswordDto) {
        try {
            const user = await this.validateUser(passwordDto.email);
            // Generate a JWT token with user information and expires in 5 minutes
            const password_token = this.generateToken({ email: user.email, _id: user._id }, '5m');
            // Generate expires_at and created_at timestamps
            const expires_at = this.generateExpiresAt(5);
            const created_at = new Date();
            // Construct reset data
            const resetData = { user_id: user._id.toString(), token: password_token, expires_at, created_at };
            // const resetValue = this.generateUserResetData(validUser.email);
            await this.resetRepo.create(resetData);

            // sent the token data to the notification microservice
            const resetCredentials = { user_id: user._id, fullName: user.firstName + " " + user.lastName, token: password_token, expires: expires_at }

            await lastValueFrom(this.notificationClient.emit('user_password_reset', resetCredentials));
            console.log("sending a user reset-password-credentials event to RabbitMQ")

            return { status: "success", message: "We sent you an email address for further verifications" }
        } catch (error) {
            throw error;
        }

    }

    async resetUserPassword(token: string) {
        try {
            const data = await this.verifyResetToken(token);
            if (!data.userId) throw new ApplicationException("There was a problem trying to verify your token! Please try again.")
            const encodedUserIdData = btoa(data.userId.toString());
            const encodedTimeData = btoa(data.expires_at.toString());
            console.log(encodedTimeData, encodedUserIdData);
            return `http://localhost:3001/reset-password/${encodedUserIdData}/${encodedTimeData}`;
        } catch (error) {
            throw error;
        }
    }

    async verifyResetToken(token: string): Promise<{ userId: string, expires_at: Date }> {
        try {
            const user = await this.findUserByResetToken(token);

            if (!user) {
                throw new ApplicationException("Invalid Token!!!"); // Token does not exist in database
            }

            if (!this.checkTimeExpiration(user.expires_at)) throw new ApplicationException("Token has expired! Request for another Token"); // Token has expired

            return { userId: user.user_id, expires_at: user.expires_at }; // Token is valid and not expired
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

    async validateUser(email: string) {
        try {
            // Find user by email
            const user = await this.authService.findAUser(email);
            if (!user) {
                throw new ApplicationException(`User with this email ${email} could not be found!`);
            }
            return user
        } catch (error) {
            throw error;
        }
    }

    generateExpiresAt(expirationMinutes: number): Date {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
        return expiresAt;
    }

    generateToken(payload: any, expiresIn: string): string {
        return this.jwtService.sign(payload, { expiresIn });
    }

    // findAll() {
    //     return `This action returns all resetPassword`;
    // }

    async findOne(_id: string) {
        try {
            return await this.resetRepo.findOne({ _id });
        } catch (error) {
            throw error;
        }
    }

    async findUserByResetToken(token: string) {
        try {
            return await this.resetRepo.findOne({ token })
        } catch (error) {
            throw error;
        }
    }

    // update(id: number, updateResetPasswordDto: UpdateResetPasswordDto) {
    //     return `This action updates a #${id} resetPassword`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} resetPassword`;
    // }
}
