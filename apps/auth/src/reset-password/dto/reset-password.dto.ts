import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}