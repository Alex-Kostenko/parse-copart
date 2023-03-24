import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async saveAll(createCarDtos: CreateCarDto[]): Promise<IPositiveRequest> {
    const moviesEntities = this.carEntity.create(createCarDtos);
    const saveMovie = await this.carEntity.save(moviesEntities);

    if (!saveMovie) {
      throw new BadRequestException('Couldn`t save cars');
    }

    return { success: true };
  }

  async saveOne(car: CarEntity): Promise<IPositiveRequest> {
    const saveMovie = await this.carEntity.save(car);

    if (!saveMovie) {
      throw new BadRequestException('Couldn`t save car');
    }

    return { success: true };
  }

  async findOneCar(lotId: string): Promise<CarEntity> {
    const findCar = this.carEntity.findOne({ where: { lot_id: lotId } });

    if (!findCar) {
      throw new NotFoundException('Car is not exist');
    }
    return findCar;
  }

  async findAllPaginate(page: number, pageSize: number): Promise<any> {
    const query = this.carEntity
      .createQueryBuilder('cars')
      .orderBy('cars.lot_id', 'ASC')
      .where('cars.sale_date IS NOT NULL')
      .andWhere(`cars.sale_date <> :futureDate`, { futureDate: 'Future' })
      .andWhere(`DATE(cars.sale_date) = DATE(NOW())`)
      .take(pageSize)
      .skip((page - 1) * pageSize);

    const totalAmount = await query.getCount();
    const totalPages = Math.ceil(totalAmount / pageSize);

    const cars = await query.getMany();

    if (!cars.length) {
      throw new NotFoundException('Cars are not exist');
    }
    return { cars: cars, totalPages: totalPages };
  }

  async getTotalAmout(): Promise<number> {
    const totalAmount = this.carEntity
      .createQueryBuilder('cars')
      .orderBy('cars.lot_id', 'ASC')
      .where('cars.sale_date IS NOT NULL')
      .andWhere(`cars.sale_date <> :futureDate`, { futureDate: 'Future' })
      .andWhere(`DATE(cars.sale_date) = DATE(NOW())`)
      .cache(true)
      .getCount();

    if (!totalAmount) {
      throw new NotFoundException('Cars are not exist');
    }

    return totalAmount;
  }
}
