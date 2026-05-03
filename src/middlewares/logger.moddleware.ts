// src/middlewares/logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {

    const { method, url } = req;
    const startTime = Date.now();  // 👈 Request start time

    // 👇 Response finish hone par log karo
    res.on('finish', () => {
      const duration = Date.now() - startTime;  // 👈 Kitna time laga
      const statusCode = res.statusCode;
      const timestamp = new Date().toISOString();

      // 👇 Status code ke hisaab se color
      const color = this.getColor(statusCode);
      const reset = '\x1b[0m';

      console.log(
        `${color}[${timestamp} ${method} ${url} - ${statusCode} - ${duration}ms ${reset}]`
      );
    });

    next();  // 👈 Aage bhejo — controller tak
  }
  // 👇 Status code se color nikalo
  private getColor(statusCode: number): string {
    if (statusCode >= 500) return '\x1b[31m';  // 🔴 Red — Server Error
    if (statusCode >= 400) return '\x1b[33m';  // 🟡 Yellow — Client Error
    if (statusCode >= 200) return '\x1b[32m';  // 🟢 Green — Success
    return '\x1b[0m';
  }
}