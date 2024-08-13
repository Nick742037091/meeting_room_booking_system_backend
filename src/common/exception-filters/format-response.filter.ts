import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class FormatResponseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const res = exception.getResponse() as { message: string[] };
    response.statusCode = exception.getStatus();

    response.json({
      code: exception.getStatus(),
      message: 'fail',
      // 存在res.message.join说明是ValidatePipe的message，优先取该值
      data: res?.message?.join ? res?.message?.join(', ') : exception.message,
    });
  }
}
