import { RmqService } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationService } from './notifications.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService, private readonly rmqService: RmqService) { }

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @EventPattern('new_user_created')
  handleNewUserCreated(@Payload() user_data: any, @Ctx() context: RmqContext) {
    this.notificationService.sendPasswordResetEmail(user_data);
    this.rmqService.ack(context)
  }

  @EventPattern('user_password_changed')
  handleUserPasswordChanged(@Payload() user_data: any, @Ctx() context: RmqContext) {
    this.notificationService.sendNotification(user_data);
    this.rmqService.ack(context)
  }

  @EventPattern('user_password_reset')
  handleUserPasswordReset(@Payload() user_data: any, @Ctx() context: RmqContext) {
    this.notificationService.sendPasswordResetEmail(user_data);
    this.rmqService.ack(context)
  }
}
