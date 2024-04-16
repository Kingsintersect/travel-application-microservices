import { Injectable, Logger } from '@nestjs/common';
// import { MailerService } from './mailer/mailer.service';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor() { }

    getHello(): string {
        return 'Hello World!';
    }

    async sendPasswordResetEmail(data: any) {
        this.logger.log("sending mail notification to the new user...", data);
        try {
            const resetToken = data.token;
            const email = data.email;
            const resetLink = `https://yourdomain.com/verify-token?token=${resetToken}`;
            const emailText = `Click the following link to reset your password: ${resetLink}`;
            // return await this.mailerService.sendMail(email, 'Password Reset', emailText);
            return { email, emailText };
        } catch (error) {
            throw error;
        }
    }

    sendNotification(data: any) {
        this.logger.log("sending message notification to the new user...", data);
    }
}
