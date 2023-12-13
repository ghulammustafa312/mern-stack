import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const defaultHttpCode = this.reflector.get(
      HTTP_CODE_METADATA,
      context.getHandler(),
    );
    const response: Response = context.switchToHttp().getResponse();
    const request: Request = context.switchToHttp().getRequest();
    this.checkNullOrUndefinedOrExcluded(request.url);

    const HttpStatus = {
      GET: 200,
      POST: 201,
      PUT: 202,
      PATCH: 202,
      DELETE: 200,
    };

    return next.handle().pipe(
      map((data) => {
        !defaultHttpCode &&
          response.status(
            response?.statusCode > 300
              ? response.statusCode
              : HttpStatus[request.method.toUpperCase()],
          );
        return {
          data:
            request.method.toUpperCase() === 'DELETE'
              ? null
              : data?.data ?? data ?? null,
          message: 'Success',
          errors: data?.errors ?? null,
        };
      }),
    );
  }

  private checkNullOrUndefinedOrExcluded(url: string) {
    if (url?.includes('null') || url?.includes('undefined')) {
      throw new BadRequestException('Invalid Request URL.');
    }
  }
}
