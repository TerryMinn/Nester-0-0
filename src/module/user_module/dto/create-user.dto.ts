import { Types } from 'mongoose';
import { Gender } from '../entities/user.entities';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The username of the user',
    default: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The email of the user',
    default: 'V4T7H@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The password of the user',
    default: '**Password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The gender of the user',
    default: Gender.MALE,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  @IsString()
  gender: Gender;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'The profile of the user',
    default: {},
  })
  @IsObject()
  @IsOptional()
  profile: Record<string, any>;

  @ApiProperty({
    type: Array,
    required: false,
    description: 'The device of the user',
    default: [],
  })
  @IsArray()
  @IsOptional()
  device: [];

  @ApiProperty({
    type: String,
    required: false,
    description: 'The created_by of the user',
    default: '',
  })
  @IsString()
  @IsOptional()
  created_by: string;

  created_at: Date;
  updated_at: Date;
}
