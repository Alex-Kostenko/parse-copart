import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCarDto {
  @ApiProperty({ type: String })
  lot_id: string;

  @ApiProperty({ type: String })
  sale_status: string;

  @ApiPropertyOptional({ type: Number })
  car_cost?: number;
}
