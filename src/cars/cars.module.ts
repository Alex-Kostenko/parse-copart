import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './entities/car.entity';
import { CarsRepository } from './cars.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository],
  exports: [CarsRepository],
})
export class CarsModule {}
