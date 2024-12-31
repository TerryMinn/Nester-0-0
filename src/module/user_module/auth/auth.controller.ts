import {
  Body,
  Controller,
  Req,
  Res,
  UseGuards,
  Post,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import DeviceDetector = require('device-detector-js');
import { Representation } from '../../../common/helper/representation.helper';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '../../../common/guard/auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const user = await this.authService.login(loginDto);

      const deviceDetector = new DeviceDetector();
      const device = deviceDetector.parse(request.headers['user-agent']);

      const deviceInfo = {
        browser: device?.client?.name || 'mobile',
        os: device?.os?.name || 'Android Os',
        deviceType: device.device?.type || 'Mobile',
      };

      const result = await this.authService.generateToken(user, deviceInfo);

      return new Representation(
        'Login Success Fully',
        result,
        response,
      ).sendMutate();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('register')
  async register(@Body() createUser: CreateUserDto, @Res() response: Response) {
    try {
      const result = await this.authService.register(createUser);

      return new Representation(
        'Register Success Fully',
        result,
        response,
      ).sendMutate();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
