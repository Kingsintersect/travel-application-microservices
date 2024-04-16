import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { PasswordResetRepository } from './reset-password.repository';
import { AuthService } from '../auth.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordReset, PasswordResetSchema } from './schema/password-reset.schema';
import { NOTIFICATION_SERVICE } from '../constants/services';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    MongooseModule.forFeature([{ name: PasswordReset.name, schema: PasswordResetSchema }]),
    RmqModule.register({ name: NOTIFICATION_SERVICE })
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, AuthService, PasswordResetRepository],
})
export class ResetPasswordModule { }
