import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
import { CarsModule } from 'src/cars/cars.module';
import { HttpModule } from '@nestjs/axios';
import { CarsService } from 'src/cars/cars.service';

@Module({
  imports: [CarsModule, HttpModule],
  controllers: [ParserController],
  providers: [ParserService, CarsService],
})
export class ParserModule {}
