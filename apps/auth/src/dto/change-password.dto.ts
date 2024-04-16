import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    current_password: string;

    @IsString()
    @IsNotEmpty()
    proposed_pass: string;
}