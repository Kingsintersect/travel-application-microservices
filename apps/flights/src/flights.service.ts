import { Injectable } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FlightRepository } from './flight.repository';

@Injectable()
export class FlightsService {
  constructor(private readonly flightRepo: FlightRepository) { }

  async getallFlights(): Promise<any[]> {
    try {
      const flights = await this.flightRepo.find({});

      return flights;
    } catch (err) {

    }
  }

  async createFlight(flightData: CreateFlightDto) {
    try {
      const flight = await this.flightRepo.create(flightData);

      return flight
    } catch (err) {

    }
  }
}
