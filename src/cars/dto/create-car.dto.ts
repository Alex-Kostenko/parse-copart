import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ type: String })
  lot_id: string;

  @ApiProperty({ type: String })
  lot_url: string;

  @ApiPropertyOptional({ type: String })
  title?: string;

  @ApiPropertyOptional({ type: Number })
  year?: number;

  @ApiProperty({ type: String })
  make?: string;

  @ApiPropertyOptional({ type: String })
  model?: string;

  @ApiProperty({ type: String })
  vin: string;

  @ApiPropertyOptional({ type: String })
  colors?: string;

  @ApiPropertyOptional({ type: String })
  engine?: string;

  @ApiPropertyOptional({ type: String })
  transmission?: string;

  @ApiPropertyOptional({ type: String })
  drive?: string;

  @ApiPropertyOptional({ type: String })
  fuel?: string;

  @ApiPropertyOptional({ type: String })
  grid?: string;

  @ApiPropertyOptional({ type: String })
  title_code?: string;

  @ApiPropertyOptional({ type: String })
  odometer?: string;

  @ApiPropertyOptional({ type: String })
  odometer_description?: string;

  @ApiPropertyOptional({ type: String })
  damage_description?: string;

  @ApiPropertyOptional({ type: Number })
  item_number?: number;

  @ApiPropertyOptional({ type: String })
  sale_name?: string;

  @ApiPropertyOptional({ type: String })
  sale_date?: string;

  @ApiPropertyOptional({ type: String })
  repair_estimate?: string;

  @ApiPropertyOptional({ type: String })
  retail_value?: string;

  @ApiPropertyOptional({ type: String })
  location?: string;

  @ApiPropertyOptional({ type: String })
  source_photos?: string;

  @ApiPropertyOptional({ type: [String] })
  photos?: string[];
}
