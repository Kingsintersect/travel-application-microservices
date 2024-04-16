import { IsString, IsNotEmpty, IsDate } from "class-validator";

export class CreateResetPasswordDto {
    user_id: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    @IsDate()
    expires_at: Date;

    @IsString()
    @IsNotEmpty()
    @IsDate()
    created_at: Date;

}
