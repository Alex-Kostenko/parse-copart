import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { CarsModule } from './cars/cars.module';
import { configService } from './config/config.service';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    HttpModule,
    CarsModule,
    ParserModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
