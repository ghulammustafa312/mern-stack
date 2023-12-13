import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsEnum,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Type } from 'class-transformer';
import { USER_ROLE } from 'src/common/constants/enum';
import { AddressDto } from './user.dto';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String })
  @IsEmail()
  readonly email: string;
  @ApiProperty({ type: String })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ type: [AddressDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  readonly addresses: AddressDto[];

  @ApiProperty({ enum: USER_ROLE })
  @IsEnum(USER_ROLE)
  readonly role: string;

  @ApiProperty({ type: String, example: '+923123456789' })
  @IsPhoneNumber()
  readonly phoneNo: string;
}
