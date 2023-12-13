import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListUserDto {
  @ApiProperty({ type: String, required: false, description: 'name search' })
  @IsString()
  @IsOptional()
  search: string;
  @ApiProperty({
    type: Number,
    required: false,
    description: 'limit',
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(5)
  limit: number;
  @ApiProperty({
    type: Number,
    required: false,
    description: 'page ',
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;
}
