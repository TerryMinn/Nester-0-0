import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'User phone number',
    default: '09420306085',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'User bio',
    default: 'I am a user',
  })
  bio?: string;
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
  oauth_providers?: OAuthProviderDto[];
}
