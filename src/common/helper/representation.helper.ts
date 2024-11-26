import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class RepresentationHelper<T> {
  message: string;
  page_count: number | null;
  D: T;
  total: number | null;
  limit: number | null;
  statusCode: HttpStatus;
  response: Response;

  constructor(
    message: string,
    response: Response,
    statusCode: HttpStatus,
    D?: T,
    total?: number,
    limit?: number,
  ) {
    this.message = message;
    this.D = D;
    this.response = response;
    this.statusCode = statusCode;
    this.total = total || null;
    this.limit = limit || null;
    this.page_count = Math.ceil(this.total / this.limit);
  }

  private metaGenerator() {
    return {
      url: process.env.RESPONSE_URL,
      endpoint: this.response.req.url,
      method: this.response.req.method,
      total: this.total,
      limit: this.limit,
      page_count: this.page_count,
    };
  }

  private linkGenerator() {
    return {
      self: `${process.env.RESPONSE_URL}${this.response.req.url}`,
      prev:
        Number(this.response.req.query.page) > this.page_count
          ? `${process.env.RESPONSE_URL + this.response.req.url}?limit=10&page=${Number(this.response.req.query.page) - 1}`
          : null,
      next: `${process.env.RESPONSE_URL + this.response.req.url}?limit=10&page=${Number(this.response.req.query.page) <= this.page_count ? Number(this.response.req.query.page) + 1 : null}`,
      first: `${process.env.RESPONSE_URL + this.response.req.url}?limit=10&page=1`,
      last: `${process.env.RESPONSE_URL + this.response.req.url}?limit=10&page=${this.page_count}`,
    };
  }

  public send() {
    return this.response.status(this.statusCode).json({
      con: true,
      message: this.message,
      statusCode: HttpStatus.OK,
      data: this.D,
      meta: this.metaGenerator(),
      link: this.linkGenerator(),
    });
  }

  public sendSingle() {
    return this.response.status(this.statusCode).json({
      con: true,
      message: this.message,
      statusCode: HttpStatus.OK,
      data: this.D,
      meta: this.metaGenerator(),
    });
  }

  public sendMutate() {
    return this.response.status(this.statusCode).json({
      con: true,
      message: this.message,
      statusCode: HttpStatus.CREATED,
      data: this.D,
      meta: this.metaGenerator(),
    });
  }

  public sendDelete() {
    return this.response.status(this.statusCode).json({
      con: true,
      message: this.message,
      statusCode: HttpStatus.NO_CONTENT,
    });
  }
}
