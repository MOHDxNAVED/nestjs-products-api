// src/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()  // 👈 Sab exceptions pakdo
export class GlobalExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 👇 Status code nikalo
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 👇 Message nikalo
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Kuch galat ho gaya — server error';

    // 👇 Consistent response format
    response.status(statusCode).json({
      success: false,
      statusCode,
      message:
        typeof message === 'object' && 'message' in (message as object)
          ? (message as any).message   // 👈 Validation errors array hota hai
          : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}