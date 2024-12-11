import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entities';
import {
  createFilterObject,
  Pagination,
  PaginationQuery,
} from '../../common/helper/pagination.helper';

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
}
