import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { AbstractRepository } from "@app/common";
import { Flight } from "./schema/flight.schema";

@Injectable()
export class FlightRepository extends AbstractRepository<Flight> {
    protected readonly logger = new Logger(FlightRepository.name);

    constructor(
        @InjectModel(Flight.name) FlightModel: Model<Flight>,
        @InjectConnection() connection: Connection
    ) {
        super(FlightModel, connection);
    }
}