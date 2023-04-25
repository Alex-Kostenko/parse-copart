import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cars')
export class CarEntity {
  @PrimaryColumn({ type: String })
  lot_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

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
  odometer: string;

  @Column({ type: String, nullable: true })
  odometer_brand: string;

  @Column({ type: String, nullable: true })
  primary_damage: string;

  @Column({ type: String, nullable: true })
  secondary_damage: string;

  @Column({ type: String, nullable: true })
  sale_date: string;

  @Column({ type: String, nullable: true })
  retail_value: string;

  @Column({ type: String, nullable: true })
  repair_cost: string;

  @Column({ type: String, nullable: true })
  sale_location: string;

  @Column({ type: Number, nullable: true })
  car_cost: number;

  @Column({ type: String, nullable: true })
  key: string;

  @Column({ type: String, nullable: true })
  vehicle_type: string;

  @Column({ type: String, nullable: true })
  model_detail: string;

  @Column({ type: String, nullable: true })
  body_style: string;

  @Column({ type: String, nullable: true })
  sale_title_state: string;

  @Column({ type: String, nullable: true })
  run: string;

  @Column({ type: String, nullable: true })
  sale_status: string;

  @Column({ type: String, nullable: true })
  location_city: string;

  @Column({ type: String, nullable: true })
  location_state: string;

  @Column({ type: String, nullable: true })
  images_url: string;

  @Column({ type: String, nullable: true })
  trim: string;

  @Column({ type: Date, nullable: true })
  last_updated_at: Date;
}
