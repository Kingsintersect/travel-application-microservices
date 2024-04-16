import { Body, Controller, Get, Post } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) { }

  @Get()
  getHello() {
    return this.flightsService.getallFlights();
  }

  @Post()
  createFlight(@Body() details: CreateFlightDto) {
    return this.flightsService.createFlight(details);
  }
}
