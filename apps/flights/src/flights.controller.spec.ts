import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

describe('FlightsController', () => {
  let flightsController: FlightsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile();

    flightsController = app.get<FlightsController>(FlightsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(flightsController.getHello()).toBe('Hello World!');
    });
  });
});
