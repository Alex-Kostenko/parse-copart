import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './entities/car.entity';
import { CarsRepository } from './cars.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  providers: [CarsRepository],
  exports: [CarsRepository],
})
export class CarsModule {}
