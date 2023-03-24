import { Controller, Get, Param } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('get-by-lot-id/:carLotId')
  findOne(@Param('carLotId') carLotId: string) {
    return this.carsService.findOne(carLotId);
  }
}
