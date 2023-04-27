import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { pageSize } from 'src/utils/constants/main';
import { IPositiveRequest } from 'src/utils/types';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarEntity } from './entities/car.entity';

@Injectable()
export class CarsRepository {
  constructor(
    @InjectRepository(CarEntity)
    private carEntity: Repository<CarEntity>,
  ) {}

  async saveAll(сreateCarDto: CreateCarDto[]): Promise<IPositiveRequest> {
    const carEntities = this.carEntity.create(сreateCarDto);
    const saveCar = await this.carEntity.save(carEntities, { chunk: 1000 });

    if (!saveCar) {
      throw new BadRequestException('Couldn`t save cars');
    }

    return { success: true };
  }

  async updateCars(updateCarDto: UpdateCarDto[]): Promise<IPositiveRequest> {
    const saveCar = await this.carEntity.save(updateCarDto);

    if (!saveCar) {
      throw new BadRequestException('Couldn`t save cars');
    }

    return { success: true };
  }

  async getLotArray(pageNumber: number): Promise<string[]> {
    const currentDate = new Date();

    const carEntities = await this.carEntity
      .createQueryBuilder('cars')
      .select('cars.lot_id')
      .where('DATE(cars.created_at) = DATE(:created_at)', {
        created_at: currentDate,
      })
      .take(pageSize)
      .skip(pageSize * pageNumber)
      .getMany();

    if (!carEntities) throw new NotFoundException('Cars are not found');
    const lotIds = carEntities.map((car) => car.lot_id);
    return lotIds;
  }

  async getLotsNumber(): Promise<number> {
    const currentDate = new Date();

    const lotCount = await this.carEntity
      .createQueryBuilder('cars')
      .select('cars.lot_id')
      .where('DATE(cars.created_at) = DATE(:created_at)', {
        created_at: currentDate,
      })
      .getCount();

    if (!lotCount) throw new NotFoundException('Cars are not found');

    return lotCount;
  }
}
