import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from './cars/cars.module';
import { configService } from './config/config.service';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    HttpModule,
    CarsModule,
    ParserModule,
  ],
})
export class AppModule {}
