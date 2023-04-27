import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
import { CarsModule } from 'src/cars/cars.module';

@Module({
  imports: [CarsModule, HttpModule],
  controllers: [ParserController],
  providers: [ParserService],
})
export class ParserModule {}
