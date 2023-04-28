import { ApiProperty } from '@nestjs/swagger';

export class CreateModelDto {
  @ApiProperty({ type: String })
  model: string;
}
