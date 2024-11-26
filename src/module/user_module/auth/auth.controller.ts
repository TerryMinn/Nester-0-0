import {
  Body,
  Controller,
  Param,
  Req,
  Res,
  UseGuards,
  Delete,
  Get,
  Patch,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('')
@ApiTags('')
@UseGuards()
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
