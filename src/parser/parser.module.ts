import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
import { CarsModule } from 'src/cars/cars.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CarsModule, HttpModule],
  controllers: [ParserController],
  providers: [ParserService],
})
export class ParserModule {}
