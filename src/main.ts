import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
// import { InvokeRecordInterceptor } from './common/interceptors/invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用默认的dto校验管道
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // app.useGlobalInterceptors(new InvokeRecordInterceptor());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
