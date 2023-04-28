import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { CarsModule } from './cars/cars.module';
import { configService } from './config/config.service';
import { ParserModule } from './parser/parser.module';
import { MakesModule } from './makes/makes.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    HttpModule,
    CarsModule,
    ParserModule,
    ScheduleModule.forRoot(),
    MakesModule,
    ModelsModule,
  ],
})
export class AppModule {}
