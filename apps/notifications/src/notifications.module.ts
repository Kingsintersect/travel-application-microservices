import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { GlobalExceptionFilter } from '@app/common/error/filter/global-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_NOTIFICATION_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/notifications/.env',
    }),
    RmqModule,
  ],
  controllers: [NotificationController],
  providers: [
    ConfigService,
    NotificationService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    MailerService,
  ],
})
export class NotificationModule { }
