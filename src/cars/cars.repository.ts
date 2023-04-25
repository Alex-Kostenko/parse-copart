import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { IPositiveRequest } from 'src/core/types/main';
import { Repository } from 'typeorm';
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

  async updateCar(
    lotId: string,
    updateCarDto: UpdateCarDto,
  ): Promise<IPositiveRequest> {
    const { car_cost, sale_status } = updateCarDto;
    const searchCar = await this.carEntity.findOne({
      where: { lot_id: lotId },
    });

    if (!searchCar) throw new NotFoundException('Car not found');
    searchCar.sale_status = sale_status;

    if (car_cost) {
      searchCar.car_cost = car_cost;
    }

    const updateCar = await this.carEntity.save(searchCar);

    if (!updateCar) {
      throw new BadRequestException('Couldn`t update car');
    }

    return { success: true };
  }

  async getAll() {
    const currentDate = new Date();

    const carEntities = await this.carEntity
      .createQueryBuilder('cars')
      .select('cars.lot_id')
      .where('DATE(cars.created_at) = DATE(:created_at)', {
        created_at: currentDate,
      })
      .getMany();

    if (!carEntities) throw new NotFoundException('Cars are not found');

    return carEntities;
  }
}
