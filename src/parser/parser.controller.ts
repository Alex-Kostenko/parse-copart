import { Controller, Get } from '@nestjs/common';
import { IPositiveRequest } from 'src/core/types/main';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Get('csvs')
  parseCSV(): Promise<IPositiveRequest> {
    return this.parserService.parseCSVs();
  }

  @Get('cars')
  parseCars(): Promise<IPositiveRequest> {
    return this.parserService.parseCars();
  }
}
