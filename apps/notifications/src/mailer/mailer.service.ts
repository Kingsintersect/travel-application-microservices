import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        // this.transporter = nodemailer.createTransport({
        //     host: this.configService.get<string>('EMAIL_HOST'),
        //     port: this.configService.get<number>('EMAIL_PORT'),
        //     auth: {
        //         user: this.configService.get<string>('EMAIL_USERNAME'),
        //         pass: this.configService.get<string>('EMAIL_PASSWORD'),
        //     },
        // });
    }

    async sendMail(to: string, subject: string, text: string) {
        try {
            await this.transporter.sendMail({
                from: this.configService.get<string>('EMAIL_USERNAME'),
                to,
                subject,
                text,
            });
        } catch (error) {
            throw error;
        }
    }
}
