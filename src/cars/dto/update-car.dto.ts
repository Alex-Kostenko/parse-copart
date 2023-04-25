import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCarDto {
  @ApiPropertyOptional({ type: String })
  sale_status: string;

  @ApiPropertyOptional({ type: Number })
  car_cost?: number;
}
