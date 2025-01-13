import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entities';
import {
  createFilterObject,
  Pagination,
  PaginationQuery,
} from '../../common/helper/pagination.helper';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async getAll(query: PaginationQuery) {
    const filterObj = createFilterObject(query, 'name');

    const all = await this.userModel.countDocuments({
      ...filterObj,
    });
    const plainQuery = this.userModel.find({
      ...filterObj,
    });

    const dbQuery = new Pagination(plainQuery, query)
      .filter('name')
      .sort()
      .paginate();

    return {
      data: await dbQuery
        .execute()
        .select('+created_by')
        .populate('created_by'),
      totalCount: all,
    };
  }

  profileUpdate(user: Request['payload'], updateUserDto: UpdateUserDto) {
    return this.userModel
      .findOneAndUpdate({ _id: user._id }, updateUserDto, { new: true })
      .select('+created_by')
      .populate('created_by');
  }
}
