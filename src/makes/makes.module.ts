import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MakeEntity } from './entities/make.entity';
import { MakesService } from './makes.service';

@Module({
  imports: [TypeOrmModule.forFeature([MakeEntity])],
  providers: [MakesService],
  exports: [MakesService],
})
export class MakesModule {}
