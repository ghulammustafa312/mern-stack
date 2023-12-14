import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exceptionData: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    try {
      const exception = {
        message:
          typeof exceptionData?.message == 'string'
            ? exceptionData?.message
            : exceptionData || 'Pipeline Failed',
        ...(typeof exceptionData == 'object' && exceptionData),
      };
      const httpStatus: number = this.getStatusCode(exception);
      const message: string | null = this.getMessage(exception) || null;
      const errors: string[] = this.getErrors(exception, message);
      const responseBody = {
        data: null,
        message,
        errors,
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } catch (err) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          data: null,
          message: 'Contact Ghulam Mustafa.',
          errors: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getStatusCode(exception: any) {
    if (!exception.name && !exception.message && !exception.getStatus()) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    switch (true) {
      case exception instanceof HttpException:
        return exception.getStatus();
      case !!exception?.error?.statusCode:
        return exception?.error?.statusCode;
      case !!exception?.['$metadata']?.httpStatusCode:
        return exception['$metadata']?.httpStatusCode;
      case Boolean(
        (typeof exception?.message == 'string'
          ? exception?.message
          : exception?.name
        )?.match(/(NotAuthorized|Unauthorized)/i),
      ):
        return HttpStatus.UNAUTHORIZED;
      case Boolean(
        (typeof exception?.message == 'string'
          ? exception?.message
          : exception?.name
        )?.match(/(notfound|found)/i),
      ):
        return HttpStatus.NOT_FOUND;
      case Boolean(
        (typeof exception?.message == 'string'
          ? exception?.message
          : exception?.name
        )?.match(/(invalid|must|should)/i),
      ):
        return HttpStatus.BAD_REQUEST;
      case Boolean(
        (typeof exception?.message == 'string'
          ? exception?.message
          : exception?.name
        )?.match(/(already|exists)/i),
      ):
        return HttpStatus.CONFLICT;
      default:
        return (
          exception?.error?.statusCode ||
          exception?.statusCode ||
          (typeof exception?.status == 'number' && exception?.status) ||
          exception?.error?.name ||
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  private getMessage(exception: any) {
    if (exception?.message && Object.keys(exception?.message).length === 0) {
      return 'Internal Server Error';
    }

    if (
      exception.message.hasOwnProperty('original') &&
      exception.message?.original?.hasOwnProperty('text')
    ) {
      return exception.message.original.text;
    }
    switch (true) {
      case Array.isArray(exception?.response?.message):
        return exception?.response?.message[0];
      case !!exception['$fault']:
        return 'Internal Server Error';
      case exception?.message?.includes(' JSON '):
        return 'Invalid Request Body';
      case exception?.message?.includes('Forbidden'):
        return 'Role Not Allowed';
      default:
        return exception.message
          ?.replace(/group/i, 'Role')
          .replace('Password did not conform with policy: ', '');
    }
  }

  private getErrors(exception: any, message: string | null) {
    if (
      !exception.hasOwnProperty('errors') &&
      exception.message.hasOwnProperty('original') &&
      exception.message?.original?.hasOwnProperty('text')
    ) {
      return exception.message.original.text;
    }
    switch (true) {
      case Array.isArray(exception.errors):
        return exception.errors;
      case typeof exception.errors == 'object':
        return Object.values(exception.errors);
      case Array.isArray(exception?.response?.errors):
        return exception?.response?.errors;
      case Array.isArray(exception?.response?.message):
        return exception?.response?.message;
      default:
        return message ? [message] : [];
    }
  }
}
