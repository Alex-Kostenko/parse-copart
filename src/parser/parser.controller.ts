import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IPositiveRequest } from 'src/utils/types';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  @Get('csvs')
  parseCSV(): Promise<IPositiveRequest> {
    return this.parserService.parseCSVs();
  }

  @Get('add-to-watchlist')
  addToWatchlist() {
    return this.parserService.watchlist();
  }

  @Cron(CronExpression.EVERY_30_MINUTES_BETWEEN_10AM_AND_7PM)
  @Get('update-final-bid')
  updateFinalBid(): Promise<IPositiveRequest> {
    return this.parserService.updateLotFinalBid();
  }
}
