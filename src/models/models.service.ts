import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateModelDto } from './dto/create-model.dto';
import { ModelEntity } from './entities/model.entity';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(ModelEntity)
    private modelEntity: Repository<ModelEntity>,
  ) {}

  async createModels(createModelDto: CreateModelDto[]) {
    const newModels = this.modelEntity.create(createModelDto);
    if (!newModels) throw new BadRequestException('Couldn`t create model');

    const savedModel = await this.modelEntity.save(newModels);
    if (!savedModel) throw new BadRequestException('Couldn`t save model');

    return { success: true };
  }
}
