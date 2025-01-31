import {
  Body,
  Controller,
  Req,
  Res,
  UseGuards,
  Post,
  BadRequestException,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CheckPasswordDTO, LoginDto } from '../dto/auth.dto';
import { Representation } from '../../../common/helper/representation.helper';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';

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

      const result = await this.authService.generateToken(user);

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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('check-old-password')
  async checkOldPassword(
    @Body() checkOldPasswordDto: CheckPasswordDTO,
    @Res() response: Response,
  ) {
    try {
      return new Representation(
        'Password is correct',
        null,
        response,
      ).sendSingle();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordBody: ChangePasswordDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { _id } = request.payload;
      const result = await this.authService.changePassword(
        changePasswordBody,
        _id,
      );

      return new Representation(
        'Password Changed Successfully',
        result,
        response,
      ).sendMutate();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
