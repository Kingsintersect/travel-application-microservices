import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi';
import { DatabaseModule, DuplicateKeyFilter, ErrorFilter } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Flight, FlightSchema } from './schema/flight.schema';
import { FlightRepository } from './flight.repository';
import { LoggerModule } from '@app/common/middleware/logger/logger.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: './apps/flights/.env',
    }),
    DatabaseModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: Flight.name, schema: FlightSchema }]),
  ],
  controllers: [FlightsController],
  providers: [
    FlightsService,
    FlightRepository,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DuplicateKeyFilter,
    },
  ],
})
export class FlightsModule { }
