import { Injectable } from '@nestjs/common';
import { CarsRepository } from './cars.repository';

@Injectable()
export class CarsService {
  constructor(private carsRepository: CarsRepository) {}
  findOne(id: string) {
    return this.carsRepository.findOneCar(id);
  }
}
