import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IPositiveRequest } from 'src/utils/types';
import { CreateMakeDto } from './dto/create-make.dto';
import { MakeEntity } from './entities/make.entity';

@Injectable()
export class MakesService {
  constructor(
    @InjectRepository(MakeEntity)
    private makeEntity: Repository<MakeEntity>,
  ) {}
  async createMakes(createMakeDto: CreateMakeDto[]): Promise<IPositiveRequest> {
    const newMakes = this.makeEntity.create(createMakeDto);
    if (!newMakes) throw new BadRequestException('Couldn`t create makes');

    const savedMake = await this.makeEntity.save(newMakes);
    if (!savedMake) throw new BadRequestException('Couldn`t save makes');

    return { success: true };
  }
}
