import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AuthService } from '../../module/user_module/auth/auth.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsOldPasswordCorrect', async: true })
@Injectable()
export class IsOldPasswordCorrect implements ValidatorConstraintInterface {
  constructor(private readonly authService: AuthService) {}

  async validate(oldPassword: string, args: ValidationArguments) {
    try {
      const userEmail = args.object['email'];
      return this.authService.isOldPasswordCorrect(userEmail, oldPassword);
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Old password is incorrect';
  }
}
