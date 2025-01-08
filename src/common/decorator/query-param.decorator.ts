import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export class QueryParamsDto {
  limit?: number;
  page?: number;
  sort_direction?: string;
  sort_by?: string;
  q?: string;
}

export function QueryParams() {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items to fetch',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'sort_direction',
      required: false,
      type: String,
      description: 'Sorting order (asc or desc)',
    }),
    ApiQuery({
      name: 'sort_by',
      required: false,
      type: String,
      description: 'Sorting item',
    }),
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: 'Search query',
    }),
  );
}
