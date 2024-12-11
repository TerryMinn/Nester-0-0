import { FilterQuery } from 'mongoose';

type AnyObject = {
  [key: string]: any;
};

export type PaginationQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  scope?: 'inner' | 'outer';
  q?: string;
  filter_by?: string;
  filter_value?: string;
  [key: string]: any;
};

export function createFilterObject(queryString: AnyObject, regexField: string) {
  let queryStr = { ...queryString };

  const toRemoveFields: string[] = [
    'limit',
    'sort',
    'page',
    'sort_by',
    'sort_direction',
  ];

  toRemoveFields.map((el: string) => {
    delete queryStr[el];
  });

  if (queryStr) {
    const forMattedQueryStr = JSON.stringify(queryStr).replace(
      /\b(lte|gte|lt|gt)/,
      (matched) => `$` + matched,
    );

    queryStr = JSON.parse(forMattedQueryStr);

    // Use the 'q' value to create a regex for the specified 'regexField'
    if (queryString.q && regexField) {
      queryStr[regexField] = new RegExp(queryString.q as string, 'i');
    }

    Object.entries(queryStr).forEach(([key, value]) => {
      if (value == 'true') {
        queryStr[key] = true;
      } else if (value == 'false') {
        queryStr[key] = false;
      }
    });

    delete queryStr.q;

    return queryStr;
  }
}

export function createFilteredByObject(query: PaginationQuery) {
  const key = query.filter_by?.replace(/ /g, '_');

  if (key !== 'undefined' && !!key) {
    return {
      [key]: query.filter_value,
    };
  }

  return {};
}

export class Pagination<T> {
  constructor(
    private dbQuery: any,
    private queryString: AnyObject,
  ) {}

  filter(regexFields: string) {
    const filterObj = createFilterObject(this.queryString, regexFields);
    this.dbQuery.find(filterObj as FilterQuery<T>);
    return this;
  }

  filterField() {
    const key = this.queryString.filter_by?.replace(/ /g, '_');

    if (key !== 'undefined' && !!key) {
      this.dbQuery.find({
        [key]: this.queryString.filter_value,
      });
    }

    return this;
  }

  paginate() {
    let limit = +this.queryString?.limit || 5;
    let page = +this.queryString?.page || 1;

    this.dbQuery.skip(limit * (page - 1)).limit(limit);

    return this;
  }

  sort() {
    let sortBy = this.queryString.sort_by || 'createdAt';
    let sortDirection = this.queryString.sort_direction === 'asc' ? 1 : -1;

    this.dbQuery.sort({ [sortBy]: sortDirection });

    return this;
  }

  execute() {
    return this.dbQuery;
  }
}
