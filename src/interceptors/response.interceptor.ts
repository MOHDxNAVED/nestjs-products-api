// src/interceptors/response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message: this.getMessage(request.method),  // 👈 Method se message
        data,                                       // 👈 Actual response data
        timestamp: new Date().toISOString(),
      })),
    );
  }

  // 👇 HTTP Method se message nikalo
  private getMessage(method: string): string {
    const messages = {
      GET: 'Data fetch ho gaya',
      POST: 'Successfully create ho gaya',
      PATCH: 'Successfully update ho gaya',
      DELETE: 'Successfully delete ho gaya',
    };
    return messages[method] || 'Request successful';
  }
}