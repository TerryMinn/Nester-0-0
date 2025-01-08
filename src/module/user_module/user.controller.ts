import {
  BadRequestException,
  Controller,
  Get,
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async profile(@Res() response: Response, @Req() request: Request) {
    try {
      const user = request.payload;
      return new Representation('Profile Data', user, response).sendSingle();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
