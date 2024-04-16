import { ApplicationException } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { Users } from './schema/users.schema';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NOTIFICATION_SERVICE } from '../constants/services';

@Injectable()
export class UsersService {
    constructor(private readonly userRepo: UsersRepository, @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy) { }

    async create(userDto: CreateUserDto) {
        const email = userDto.email;
        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password, salt);
        try {
            const user_exists = await this.UserExists(email);
            if (user_exists) {
                throw new ApplicationException('User already exists with Email: ' + email);
            }

            const user = await this.userRepo.create(userDto);
            delete user.password;
            await lastValueFrom(this.notificationClient.emit('new_user_create', { user }));
            console.log("sending a user created event to abbitMQ")
            return user;
        } catch (err) {
            throw err
        }
    }

    async UserExists(filter: string): Promise<Users | null> {
        const user = await this.userRepo.checkExistence({ filter });
        return user || null;
    }

    async findAll(): Promise<Users[]> {
        return await this.userRepo.find({});
    }

    async findOne(email: string) {
        return await this.userRepo.findOne({ email });
    }

    async update(_id: string, updateUserDto: UpdateUserDto): Promise<Users> {
        console.log({ _id }, updateUserDto)
        try {
            const user = await this.userRepo.findOneAndUpdate({ _id }, updateUserDto);
            delete user.password;
            return user;
        } catch (err) {
            throw err;
        }
    }

    async delete(_id: string) {
        try {
            return await this.userRepo.findOneAndDelete({ _id });
        } catch (err) {
            throw err;
        }
    }
}
