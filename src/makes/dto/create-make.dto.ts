import { ApiProperty } from '@nestjs/swagger';

import { ModelEntity } from 'src/models/entities/model.entity';

export class CreateMakeDto {
  @ApiProperty({ type: String })
  make: string;

  @ApiProperty({ type: String })
  model: ModelEntity;
}
