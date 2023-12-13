import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AddressDto } from './user.dto';
import { USER_ROLE } from 'src/utils/enum';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ type: [AddressDto], required: false })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  readonly addresses: AddressDto[];

  @ApiProperty({ enum: USER_ROLE, required: false })
  @IsEnum(USER_ROLE)
  @IsOptional()
  readonly role: string;

  @ApiProperty({ type: String, example: '+923123456789', required: false })
  @IsOptional()
  readonly phoneNo: string;
}
