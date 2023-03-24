import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PaginateDto {
  @ApiProperty({ type: Number, name: 'pageSize', default: 10, required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize: number;

  @ApiProperty({ type: Number, name: 'page', default: 1, required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10000000)
  page: number;
}
