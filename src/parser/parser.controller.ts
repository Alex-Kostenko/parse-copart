import { Controller, Get } from '@nestjs/common';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Get('csvs')
  parseCSV() {
    return this.parserService.parseCSVs();
  }

  @Get('cars')
  parseCars() {
    return this.parserService.parseCars();
  }
}
