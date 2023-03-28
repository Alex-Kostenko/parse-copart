import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IPositiveRequest } from 'src/core/types/main';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}
  // @Cron(CronExpression.EVERY_DAY_AT_9AM)
  @Get('csvs')
  parseCSV(): Promise<IPositiveRequest> {
    return this.parserService.parseCSVs();
  }

  // @Cron(CronExpression.EVERY_DAY_AT_10AM)
  @Get('cars')
  parseCars(): Promise<IPositiveRequest> {
    return this.parserService.parseCars();
  }
}
