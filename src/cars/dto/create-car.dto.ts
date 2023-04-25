import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ type: String })
  lot_id: string;

  @ApiPropertyOptional({ type: String })
  sale_location?: string;

  @ApiPropertyOptional({ type: String })
  sale_date?: string;

  @ApiPropertyOptional({ type: String })
  vehicle_type?: string;

  @ApiPropertyOptional({ type: Number })
  year?: number;

  @ApiPropertyOptional({ type: String })
  make?: string;

  @ApiPropertyOptional({ type: String })
  model?: string;

  @ApiPropertyOptional({ type: String })
  model_detail?: string;

  @ApiPropertyOptional({ type: String })
  body_style?: string;

  @ApiPropertyOptional({ type: String })
  color?: string;

  @ApiPropertyOptional({ type: String })
  primary_damage?: string;

  @ApiPropertyOptional({ type: String })
  secondary_damage?: string;

  @ApiPropertyOptional({ type: String })
  sale_title_state?: string;

  @ApiPropertyOptional({ type: String })
  key?: string;

  @ApiPropertyOptional({ type: String })
  vin?: string;

  @ApiPropertyOptional({ type: String })
  odometer?: string;

  @ApiPropertyOptional({ type: String })
  odometer_brand?: string;

  @ApiPropertyOptional({ type: String })
  retail_value?: string;

  @ApiPropertyOptional({ type: String })
  repair_cost?: string;

  @ApiPropertyOptional({ type: String })
  engine?: string;

  @ApiPropertyOptional({ type: String })
  drive?: string;

  @ApiPropertyOptional({ type: String })
  transmission?: string;

  @ApiPropertyOptional({ type: String })
  fuel?: string;

  @ApiPropertyOptional({ type: String })
  run?: string;

  @ApiPropertyOptional({ type: String })
  sale_status?: string;

  @ApiPropertyOptional({ type: Number })
  car_cost?: number;

  @ApiPropertyOptional({ type: String })
  location_city?: string;

  @ApiPropertyOptional({ type: String })
  location_state?: string;

  @ApiPropertyOptional({ type: String })
  images_url?: string;

  @ApiPropertyOptional({ type: String })
  trim?: string;
}
