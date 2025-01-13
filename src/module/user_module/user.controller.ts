import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guard/auth.guard';
import { UserService } from './user.service';
import {
  QueryParams,
  QueryParamsDto,
} from '../../common/decorator/query-param.decorator';
import { Representation } from '../../common/helper/representation.helper';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @QueryParams()
  async getAll(@Query() query: QueryParamsDto, @Res() response: Response) {
    try {
      const { data, totalCount } = await this.userService.getAll(query);

      return new Representation(
        'Success',
        data,
        response,
        totalCount,
        query.limit,
      ).send();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('profile')
  async profile(@Res() response: Response, @Req() request: Request) {
    try {
      const user = request.payload;
      return new Representation('Profile Data', user, response).sendSingle();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Patch('profile')
  async profileUpdate(
    @Res() response: Response,
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = request.payload;
      const result = await this.userService.profileUpdate(user, updateUserDto);
      return new Representation(
        'Profile Updated',
        result,
        response,
      ).sendSingle();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
