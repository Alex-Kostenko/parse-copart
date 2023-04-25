import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPositiveRequest } from 'src/core/types/main';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
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

  async getAll() {
    const carEntities = await this.carEntity
      .createQueryBuilder('cars')
      .select('cars.lot_id')
      .getMany(); //TODO

    return carEntities;
  }
}
