import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModelEntity } from './entities/model.entity';
import { ModelsService } from './models.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModelEntity])],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
