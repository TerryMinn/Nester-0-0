import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UserService } from './user.service';
import {
  QueryParams,
  QueryParamsDto,
} from 'src/common/decorator/QueryParam.decorator';
import { Representation } from 'src/common/helper/representation.helper';
import { Response } from 'express';

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
    } catch (e) {}
  }
}
