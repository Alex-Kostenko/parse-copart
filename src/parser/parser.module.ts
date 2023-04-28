import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
import { CarsModule } from 'src/cars/cars.module';
import { MakesModule } from 'src/makes/makes.module';
import { ModelsModule } from 'src/models/models.module';

@Module({
  imports: [CarsModule, HttpModule, MakesModule, ModelsModule],
  controllers: [ParserController],
  providers: [ParserService],
})
export class ParserModule {}
