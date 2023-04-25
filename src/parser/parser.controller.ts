import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IPositiveRequest } from 'src/core/types/main';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}
  // @Cron(CronExpression.EVERY_DAY_AT_4PM)
  @Get('csvs')
  parseCSV(): Promise<IPositiveRequest> {
    return this.parserService.parseCSVs();
  }

  @Get('add-to-watchlist')
  addToWatchlist() {
    return this.parserService.watchlist();
  }

  // @Cron(CronExpression.EVERY_DAY_AT_10AM)
  @Get('update-final-bid')
  updateFinalBid(): Promise<void> {
    return this.parserService.updateLotFinalBid();
  }
}
