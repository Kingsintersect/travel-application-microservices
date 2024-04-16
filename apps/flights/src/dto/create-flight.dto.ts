import { IsString, IsNotEmpty } from "class-validator";
export class CreateFlightDto {
    @IsNotEmpty()
    @IsString()
    flight_number: string;

    @IsNotEmpty()
    @IsString()
    departure_airport: string;

    @IsNotEmpty()
    @IsString()
    arrival_airport: string;

    @IsNotEmpty()
    @IsString()
    departure_time: Date;

    @IsNotEmpty()
    @IsString()
    arrival_time: Date;

    @IsNotEmpty()
    @IsString()
    airline_code: string;
}