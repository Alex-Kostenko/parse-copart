import { CreateCarDto } from 'src/cars/dto/create-car.dto';
import { CarsMakesEnum } from '../enums/main';

import * as csv from 'csv-parser';
import * as fs from 'fs';

export const parseCsv = async (filePath: string): Promise<CreateCarDto[]> => {
  const results: CreateCarDto[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: { [x: string]: string }) => {
        const carEntity = {
          lot_url: process.env.COPART_LOT + data['Lot/Inv #'],
          lot_id: data['Lot/Inv #'],
          retail_value: data['Est. Retail Value'],
          sale_date: data['Sale Date'],
          year: Number(data['Year']),
          make: CarsMakesEnum[data['Make']],
          model: data['Model'],
          engine: data['Engine Type'],
          vin: data['VIN'],
          grid: data['Grid/Row'],
          title_code: data['Title Code'],
          odometer: data['Odometer'],
          odometer_description: data['Odometer Description'],
          primary_damage: data['Damage Description'],
          item_number: Number(data['Item Number']),
          sale_location: data['Sale Name'],
          repair_estimate: data['Repair Estimate'],
        };
        results.push(carEntity);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error: string) => {
        reject(error);
      });
  });
};
