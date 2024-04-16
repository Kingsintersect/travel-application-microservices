import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ErrorFilter, DuplicateKeyFilter, DatabaseModule, RmqModule } from '@app/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from '@app/common/middleware/logger/logger.middleware';
import { jwtConstants } from './constants/jwt.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common/middleware/logger/logger.module';
import { PassportModule } from '@nestjs/passport';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { NOTIFICATION_SERVICE } from './constants/services';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required(),
                PORT: Joi.string().required(),
            }),
            envFilePath: './apps/auth/.env',
        }),
        RmqModule.register({ name: NOTIFICATION_SERVICE }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '3600s' },
        }),
        DatabaseModule,
        UsersModule,
        ResetPasswordModule,
        LoggerModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        LocalStrategy,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter,
        },
        {
            provide: APP_FILTER,
            useClass: DuplicateKeyFilter,
        },
    ],
    exports: [AuthService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
        // consumer
        // .apply(LoggerMiddleware)
        // .forRoutes({ path: 'songs', method: RequestMethod.POST }); //option no 2
        consumer.apply(LoggerMiddleware).forRoutes(AuthController); //option no 3
    }
}
