import { Body, Controller, Request, Get, Post, UseGuards, Headers, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { Users } from './users/schema/users.schema';
import { SignInDto } from './dto/signin-dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UsersService) { }

    @Post('login')
    signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
        return this.authService.signIn(signInDto);
    }

    @Post('register')
    signUp(@Body() userDto: CreateUserDto): Promise<Users> {
        return this.userService.create(userDto);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    changePassword(@Headers('authorization') authorization: string, @Body() passwords: ChangePasswordDto) {
        const token = authorization.split(' ')[1];
        return this.authService.changePassword(passwords, token);
    }

    @Patch('reset-password/:id/:expires_at')
    resetPassword(@Param('id') id: string, @Param('expires_at') expire_time, @Body() password: UpdateUserDto) {
        return this.authService.resetPassword(id, expire_time, password);
    }

    // @UseGuards(AuthGuard)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
