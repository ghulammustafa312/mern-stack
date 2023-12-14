import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class IdParamDto {
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  @IsMongoId()
  id: string;
}
