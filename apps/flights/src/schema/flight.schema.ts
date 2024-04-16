import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class Flight extends AbstractDocument {
    @Prop()
    flight_number: string;

    @Prop({ required: true })
    departure_airport: string;

    @Prop({ required: true })
    arrival_airport: string;

    @Prop({ required: true })
    departure_time: Date;

    @Prop({ required: true })
    arrival_time: Date;

    @Prop({ required: true })
    airline_code: string;
}

export const FlightSchema = SchemaFactory.createForClass(Flight);