import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  IsArray,
  Min,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceType, Gender } from '../entities/user.entities';
import { ApiProperty } from '@nestjs/swagger';

class OAuthProviderDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

class ProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The picture of the user',
    default: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
  })
  picture?: string;

  @IsEnum(Gender)
  @IsString()
  @IsOptional()
  @ApiProperty({
    default: Gender.MALE,
    description: 'The gender of the user',
    required: true,
    type: String,
  })
  gender: Gender;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'The date of birth of the user',
    default: '2000-01-01',
  })
  date_of_birth?: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    default: 'V4T7H@example.com',
    description: 'The email of the user',
    required: true,
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'John Doe',
    description: 'The name of the user',
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    default: 'Password123',
    description: 'The password of the user',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDto)
  @ApiProperty({
    description: 'The profile information of the user',
    type: ProfileDto,
    required: false,
  })
  profile?: ProfileDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OAuthProviderDto)
  oauthProviders?: OAuthProviderDto[];

  device?: DeviceType[];
}
