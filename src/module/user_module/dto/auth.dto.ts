import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsOldPasswordCorrect } from 'src/common/validator/is-old-password.validator';

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
    description: 'The new password of the user',
    default: '**Password123',
  })
  @IsNotEmpty()
  @MinLength(4)
  new_password: string;
}

export class CheckPasswordDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The old password of the user',
    default: '**Password123',
  })
  @IsNotEmpty()
  @MinLength(4)
  @Validate(IsOldPasswordCorrect)
  old_password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    default: 'V4T7H@example.com',
    description: 'The email of the user',
    required: true,
    type: String,
  })
  email: string;
}
