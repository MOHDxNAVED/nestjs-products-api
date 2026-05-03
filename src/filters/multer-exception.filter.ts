// src/filters/multer-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { unlink } from 'fs/promises';

@Catch(BadRequestException)  // 👈 Validation errors pakdo
export class FileCleanupFilter implements ExceptionFilter {

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 👇 File upload hui thi? → Delete karo
    const file = request.file as Express.Multer.File;

    if (file) {
      try {
        await unlink(file.path);  // 👈 Uploads folder se delete karo
        console.log('Cleanup: Image delete ho gayi ✅');
      } catch (err) {
        console.log('Cleanup failed:', err.message);
      }
    }

    // 👇 Original error response bhejo
    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      success: false,
      statusCode: status,
      message: typeof message === 'object' && 'message' in (message as object)
        ? (message as any).message
        : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}