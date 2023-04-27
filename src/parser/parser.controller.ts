import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { IPositiveRequest } from 'src/utils/types';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  @Get('csvs')
  parseCSV(): Promise<IPositiveRequest> {
    return this.parserService.parseCSVs();
  }

  @Cron('0 */32 16-23 * * 1-5')
  @Get('update-final-bid')
  updateFinalBid(): Promise<IPositiveRequest> {
    return this.parserService.updateLotFinalBid();
  }
}
