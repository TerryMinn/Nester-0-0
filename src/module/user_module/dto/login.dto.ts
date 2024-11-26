import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

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
