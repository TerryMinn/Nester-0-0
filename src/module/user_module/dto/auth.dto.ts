import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Validate } from 'class-validator';

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The email of the user',
    default: 'V4T7H@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The password of the user',
    default: '**Password123',
  })
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The old password of the user',
    default: '**Password123',
  })
  @IsNotEmpty()
  @MinLength(4)
  old_password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The new password of the user',
    default: '**Password123',
  })
  @IsNotEmpty()
  @MinLength(4)
  new_password: string;
}
