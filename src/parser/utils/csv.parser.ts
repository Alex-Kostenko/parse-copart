import * as moment from 'moment';
import * as csv from 'csv-parser';
import * as fs from 'fs';

import { CreateCarDto } from 'src/cars/dto/create-car.dto';

export const parseCsv = async (filePath: string): Promise<CreateCarDto[]> => {
  const results: CreateCarDto[] = [];
  const currentDate = moment().format('YYYYMMDD');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: { [x: string]: string }) => {
        if (
          data['Sale Date M/D/CY'] === currentDate &&
          (data['Vehicle Type'] === 'V' || data['Vehicle Type'] === 'K') &&
          Number(data['Year']) > 2013
        ) {
          const carEntity = {
            sale_location: data['Yard name'],
            sale_date: data['Sale Date M/D/CY'],
            lot_id: data['Lot number'],
            vehicle_type: data['Vehicle Type'],
            year: Number(data['Year']),
            make: data['Make'],
            model: data['Model Group'],
            model_detail: data['Model Detail'],
            body_style: data['Body Style'],
            color: data['Color'],
            primary_damage: data['Damage Description'],
            secondary_damage: data['Secondary Damage'],
            sale_title_state: data['Sale Title State'],
            key: data['Has Keys-Yes or No'],
            vin: data['VIN'],
            odometer: data['Odometer'],
            odometer_brand: data['Odometer Brand'],
            retail_value: data['Est. Retail Value'],
            repair_cost: data['Repair cost'],
            engine: data['Engine'],
            drive: data['Drive'],
            transmission: data['Transmission'],
            fuel: data['Fuel Type'],
            run: data['Runs/Drives'],
            sale_status: data['Sale Status'],
            car_cost: Number(data['High Bid =non-vix,Sealed=Vix']),
            location_city: data['Location city'],
            location_state: data['Location state'],
            images_url: data['Image URL'],
            trim: data['Trim'],
            last_updated_at: moment(data['Last Updated Time']).toDate(),
          };
          results.push(carEntity);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error: string) => {
        reject(error);
      });
  });
};
