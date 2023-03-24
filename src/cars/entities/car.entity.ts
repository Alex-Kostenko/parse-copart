import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cars')
export class CarEntity {
  @PrimaryColumn({ type: String })
  lot_id: string;

  @Column({ type: String, nullable: true })
  lot_url: string;

  @Column({ type: String, nullable: true })
  title: string;

  @Column({ type: Number, nullable: true })
  year: number;

  @Column({ type: String, nullable: true })
  make: string;

  @Column({ type: String, nullable: true })
  model: string;

  @Column({ type: String, nullable: true })
  vin: string;

  @Column({ type: String, nullable: true })
  color: string;

  @Column({ type: String, nullable: true })
  engine: string;

  @Column({ type: String, nullable: true })
  transmission: string;

  @Column({ type: String, nullable: true })
  drive: string;

  @Column({ type: String, nullable: true })
  fuel: string;

  @Column({ type: String, nullable: true })
  grid: string;

  @Column({ type: String, nullable: true })
  title_code: string;

  @Column({ type: String, nullable: true })
  odometer: string;

  @Column({ type: String, nullable: true })
  odometer_description: string;

  @Column({ type: String, nullable: true })
  primary_damage: string;

  @Column({ type: String, nullable: true })
  secondary_damage: string;

  @Column({ type: Number, nullable: true })
  item_number: number;

  @Column({ type: String, nullable: true })
  sale_date: string;

  @Column({ type: String, nullable: true })
  retail_value: string;

  @Column({ type: String, nullable: true })
  repair_estimate: string;

  @Column({ type: String, nullable: true })
  sale_location: string;

  @Column({ type: String, array: true, default: [] })
  images: string[];

  @Column({ type: String, nullable: true })
  highlights: string;

  @Column({ type: Number, nullable: true })
  car_cost: number;

  @Column({ type: String, nullable: true })
  auction_fees: string;

  @Column({ type: String, nullable: true })
  key: string;

  @Column({ type: String, nullable: true })
  notes: string;
}
