import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class FindByLotIdDto {
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(200)
  lot_id: string;
}
